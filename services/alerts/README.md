# FloodWatch Alert Engine

Multi-channel notification delivery: SMS (Twilio), WhatsApp, Email (SMTP), Push (FCM), Webhook. Adapter pattern, retries, delivery tracking, templates.

## Endpoints

| Method & Path | Description |
|---------------|-------------|
| `POST /api/v1/alerts/send` | Dispatch an alert across channels |
| `GET /api/v1/alerts/rules` | Alert rules |
| `POST /api/v1/alerts/rules` | Create an alert rule |
| `GET /api/v1/alerts/templates` | Message templates |
| `GET /api/v1/alerts/sent` | Delivery history |

## Environment variables

| Variable | Example / default |
|----------|-------------------|
| `ALERT_DRY_RUN` | true |
| `TWILIO_ACCOUNT_SID` |  |
| `TWILIO_AUTH_TOKEN` |  |
| `TWILIO_FROM_NUMBER` |  |
| `WHATSAPP_BUSINESS_API_TOKEN` |  |
| `SMTP_HOST` |  |
| `SMTP_PORT` | 587 |
| `SMTP_USER` |  |
| `SMTP_PASSWORD` |  |
| `FCM_SERVER_KEY` |  |

## Run locally

```bash
cd services/alerts
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8007
```

Swagger UI: http://localhost:8007/docs

## Run with Docker

```bash
cd services/alerts
docker build -t floodwatch/alerts .
docker run -p 8007:8007 floodwatch/alerts
```

Or from the repo root: `docker compose up --build alerts`

## Tests

```bash
cd services/alerts
pip install pytest
pytest
```

## Integration notes

- Swagger/OpenAPI: http://localhost:8007/docs
- All responses use the unified error envelope documented in docs/api/error-handling.md
