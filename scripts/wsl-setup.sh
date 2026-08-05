#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# FloodWatch AI — WSL2 Native Setup
# Replaces Docker with native Linux services in WSL2
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${CYAN}[floodwatch]${NC} $*"; }
ok()   { echo -e "${GREEN}[  ok  ]${NC} $*"; }
warn() { echo -e "${YELLOW}[ warn ]${NC} $*"; }
err()  { echo -e "${RED}[error]${NC} $*" >&2; }

# ── Config ────────────────────────────────────────────────────
PG_USER="${POSTGRES_USER:-floodwatch}"
PG_PASS="${POSTGRES_PASSWORD:-floodwatch_dev}"
PG_DB="${POSTGRES_DB:-floodwatch}"
PG_PORT="${POSTGRES_PORT:-5432}"

REDIS_PORT="${REDIS_PORT:-6379}"

MINIO_PORT="${MINIO_PORT:-9000}"
MINIO_CONSOLE="${MINIO_CONSOLE_PORT:-9001}"
MINIO_USER="${MINIO_ACCESS_KEY:-floodwatch}"
MINIO_PASS="${MINIO_SECRET_KEY:-floodwatch_dev}"
MINIO_BUCKET="${MINIO_BUCKET:-floodwatch-data}"

# ── Detect package manager ────────────────────────────────────
if command -v apt-get &>/dev/null; then
    PKG="apt"
elif command -v dnf &>/dev/null; then
    PKG="dnf"
elif command -v pacman &>/dev/null; then
    PKG="pacman"
else
    err "Unsupported package manager. Install manually."
    exit 1
fi

log "Package manager: $PKG"

# ── System update ─────────────────────────────────────────────
log "Updating system packages..."
if [ "$PKG" = "apt" ]; then
    sudo apt-get update -qq
    sudo apt-get install -y -qq curl wget gnupg2 lsb-release ca-certificates apt-transport-https
elif [ "$PKG" = "dnf" ]; then
    sudo dnf install -y -q curl wget gnupg2
elif [ "$PKG" = "pacman" ]; then
    sudo pacman -Sy --noconfirm curl wget gnupg2
fi

# ── PostgreSQL + PostGIS ─────────────────────────────────────
log "Installing PostgreSQL + PostGIS..."
if [ "$PKG" = "apt" ]; then
    sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
    curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/pgdg.gpg
    sudo apt-get update -qq
    sudo apt-get install -y -qq postgresql-16 postgresql-16-postgis-3.4 postgresql-client-16
fi

# Start PostgreSQL
sudo systemctl enable postgresql 2>/dev/null || true
sudo systemctl start postgresql 2>/dev/null || {
    # Fallback: use pg_ctl if systemd not available in WSL
    log "systemd not available, starting PostgreSQL directly..."
    sudo -u postgres /usr/lib/postgresql/16/bin/pg_ctl -D /var/lib/postgresql/16/main start -l /var/log/postgresql/postgresql-16-main.log
}

# Create user and database
log "Setting up database..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='$PG_USER'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE USER $PG_USER WITH PASSWORD '$PG_PASS';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='$PG_DB'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE DATABASE $PG_DB OWNER $PG_USER;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $PG_DB TO $PG_USER;"
sudo -u postgres psql -d $PG_DB -c "CREATE EXTENSION IF NOT EXISTS postgis;"
sudo -u postgres psql -d $PG_DB -c "CREATE EXTENSION IF NOT EXISTS hstore;"
ok "PostgreSQL + PostGIS ready on port $PG_PORT"

# ── Redis ─────────────────────────────────────────────────────
log "Installing Redis..."
if [ "$PKG" = "apt" ]; then
    sudo apt-get install -y -qq redis-server
fi

sudo systemctl enable redis-server 2>/dev/null || true
sudo systemctl start redis-server 2>/dev/null || {
    sudo redis-server /etc/redis/redis.conf --daemonize yes
}

# Verify Redis
redis-cli -p $REDIS_PORT ping | grep -q PONG && ok "Redis ready on port $REDIS_PORT" || warn "Redis may need manual start"

# ── MinIO ─────────────────────────────────────────────────────
log "Installing MinIO..."
MINIO_DIR="$HOME/.local/bin"
mkdir -p "$MINIO_DIR"

if [ ! -f "$MINIO_DIR/minio" ]; then
    curl -fsSL "https://dl.min.io/server/minio/release/linux-amd64/minio" -o "$MINIO_DIR/minio"
    chmod +x "$MINIO_DIR/minio"
fi

if [ ! -f "$MINIO_DIR/mc" ]; then
    curl -fsSL "https://dl.min.io/client/mc/release/linux-amd64/mc" -o "$MINIO_DIR/mc"
    chmod +x "$MINIO_DIR/mc"
fi

ok "MinIO installed to $MINIO_DIR"

# Create MinIO data directory
MINIO_DATA="$HOME/.floodwatch/minio"
mkdir -p "$MINIO_DATA"

# ── Python dependencies ──────────────────────────────────────
log "Checking Python..."
if ! command -v python3 &>/dev/null; then
    log "Installing Python 3..."
    if [ "$PKG" = "apt" ]; then
        sudo apt-get install -y -qq python3 python3-pip python3-venv
    fi
fi
ok "Python: $(python3 --version)"

# ── Create service scripts ───────────────────────────────────
log "Creating service scripts..."

# Start script
cat > "$HOME/.floodwatch/start-services.sh" << 'START_EOF'
#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$DIR/logs"
mkdir -p "$LOG_DIR"

echo "[floodwatch] Starting services..."

# PostgreSQL
if ! pg_isready -q 2>/dev/null; then
    sudo systemctl start postgresql 2>/dev/null || \
        sudo -u postgres /usr/lib/postgresql/16/bin/pg_ctl -D /var/lib/postgresql/16/main start -l "$LOG_DIR/postgresql.log"
    echo "[floodwatch] PostgreSQL started"
else
    echo "[floodwatch] PostgreSQL already running"
fi

# Redis
if ! redis-cli ping &>/dev/null; then
    sudo systemctl start redis-server 2>/dev/null || \
        sudo redis-server /etc/redis/redis.conf --daemonize yes
    echo "[floodwatch] Redis started"
else
    echo "[floodwatch] Redis already running"
fi

# MinIO
if ! curl -sf http://localhost:9000/minio/health/live &>/dev/null; then
    nohup "$HOME/.local/bin/minio" server "$HOME/.floodwatch/minio" \
        --address ":9000" --console-address ":9001" \
        > "$LOG_DIR/minio.log" 2>&1 &
    echo "$!" > "$DIR/minio.pid"
    sleep 2
    echo "[floodwatch] MinIO started"
else
    echo "[floodwatch] MinIO already running"
fi

echo ""
echo "[floodwatch] All services started:"
echo "  PostgreSQL : localhost:5432"
echo "  Redis      : localhost:6379"
echo "  MinIO API  : localhost:9000"
echo "  MinIO Web  : http://localhost:9001"
START_EOF
chmod +x "$HOME/.floodwatch/start-services.sh"

# Stop script
cat > "$HOME/.floodwatch/stop-services.sh" << 'STOP_EOF'
#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "[floodwatch] Stopping services..."

# MinIO
if [ -f "$DIR/minio.pid" ]; then
    kill "$(cat "$DIR/minio.pid")" 2>/dev/null && echo "[floodwatch] MinIO stopped"
    rm -f "$DIR/minio.pid"
fi

# Redis
sudo systemctl stop redis-server 2>/dev/null || sudo redis-cli shutdown 2>/dev/null
echo "[floodwatch] Redis stopped"

# PostgreSQL
sudo systemctl stop postgresql 2>/dev/null || \
    sudo -u postgres /usr/lib/postgresql/16/bin/pg_ctl -D /var/lib/postgresql/16/main stop 2>/dev/null
echo "[floodwatch] PostgreSQL stopped"

echo "[floodwatch] All services stopped"
STOP_EOF
chmod +x "$HOME/.floodwatch/stop-services.sh"

# Status script
cat > "$HOME/.floodwatch/status-services.sh" << 'STATUS_EOF'
#!/usr/bin/env bash
echo "═══════════════════════════════════════════"
echo " FloodWatch AI — Service Status"
echo "═══════════════════════════════════════════"

# PostgreSQL
if pg_isready -q 2>/dev/null; then
    echo "  PostgreSQL : ✓ running (localhost:5432)"
else
    echo "  PostgreSQL : ✗ stopped"
fi

# Redis
if redis-cli ping &>/dev/null; then
    echo "  Redis      : ✓ running (localhost:6379)"
else
    echo "  Redis      : ✗ stopped"
fi

# MinIO
if curl -sf http://localhost:9000/minio/health/live &>/dev/null; then
    echo "  MinIO API  : ✓ running (localhost:9000)"
    echo "  MinIO Web  : http://localhost:9001"
else
    echo "  MinIO      : ✗ stopped"
fi

echo "═══════════════════════════════════════════"
STATUS_EOF
chmod +x "$HOME/.floodwatch/status-services.sh"

# Init MinIO bucket
cat > "$HOME/.floodwatch/init-minio.sh" << 'INIT_EOF'
#!/usr/bin/env bash
set -euo pipefail
MC="$HOME/.local/bin/mc"
$MC alias set floodwatch http://localhost:9000 "${MINIO_ACCESS_KEY:-floodwatch}" "${MINIO_SECRET_KEY:-floodwatch_dev}" 2>/dev/null
$MC mb --ignore-existing "floodwatch/${MINIO_BUCKET:-floodwatch-data}" 2>/dev/null
echo "[floodwatch] MinIO bucket ready: ${MINIO_BUCKET:-floodwatch-data}"
INIT_EOF
chmod +x "$HOME/.floodwatch/init-minio.sh"

ok "Service scripts created in ~/.floodwatch/"

# ── Start everything ──────────────────────────────────────────
log "Starting all services..."
bash "$HOME/.floodwatch/start-services.sh"
bash "$HOME/.floodwatch/init-minio.sh" 2>/dev/null || warn "MinIO bucket init deferred"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN} FloodWatch AI — WSL2 Setup Complete${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo " Services:"
echo "   PostgreSQL + PostGIS : localhost:5432"
echo "   Redis                : localhost:6379"
echo "   MinIO API            : localhost:9000"
echo "   MinIO Console        : http://localhost:9001"
echo ""
echo " Management:"
echo "   ~/.floodwatch/start-services.sh   — Start all"
echo "   ~/.floodwatch/stop-services.sh    — Stop all"
echo "   ~/.floodwatch/status-services.sh  — Check status"
echo ""
echo " Connect from Windows apps:"
echo "   DATABASE_URL=postgresql://floodwatch:floodwatch_dev@localhost:5432/floodwatch"
echo "   REDIS_URL=redis://localhost:6379/0"
echo ""
