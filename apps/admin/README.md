# @floodwatch/admin

Platform administration console for FloodWatch AI — the technical control plane
used by platform operators to manage users, roles, API keys, AI models, data
sources, secrets, logs, and backups.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Platform health — service status, uptime, resource usage |
| `/users` | Platform user management |
| `/roles` | Roles & permissions matrix |
| `/api-keys` | API key issuance and revocation |
| `/models` | AI model registry (versions, metrics, promotions) |
| `/data-sources` | Upstream data provider configuration |
| `/logs` | Centralized service logs |
| `/backups` | Backup schedule and restore points |
| `/settings` | Platform-wide settings and secrets |

## Development

```bash
npm install                                # from repo root (workspaces)
npm run dev --workspace=@floodwatch/admin
```

Open http://localhost:3002.
