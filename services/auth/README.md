# FloodWatch Authentication

Identity and access management: JWT authentication, OAuth2 password flow, RBAC (admin/operator/analyst/viewer) and API key issuance.

## Endpoints

| Method & Path | Description |
|---------------|-------------|
| `POST /api/v1/auth/login` | Exchange credentials for access + refresh tokens |
| `POST /api/v1/auth/refresh` | Refresh an expired access token |
| `GET /api/v1/auth/me` | Current user profile (Bearer token) |
| `POST /api/v1/auth/api-keys` | Issue an API key for programmatic access |
| `GET /api/v1/auth/users` | List users (admin only) |
| `POST /api/v1/auth/users` | Create a user (admin only) |

## Environment variables

| Variable | Example / default |
|----------|-------------------|
| `JWT_SECRET` | change-me-in-production |
| `JWT_ALGORITHM` | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 60 |
| `REFRESH_TOKEN_EXPIRE_DAYS` | 7 |

## Run locally

```bash
cd services/auth
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

Swagger UI: http://localhost:8001/docs

## Run with Docker

```bash
cd services/auth
docker build -t floodwatch/auth .
docker run -p 8001:8001 floodwatch/auth
```

Or from the repo root: `docker compose up --build auth`

## Tests

```bash
cd services/auth
pip install pytest
pytest
```

## Integration notes

- Swagger/OpenAPI: http://localhost:8001/docs
- All responses use the unified error envelope documented in docs/api/error-handling.md
