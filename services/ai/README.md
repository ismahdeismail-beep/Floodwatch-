# FloodWatch AI Prediction Engine

The brain: flood probability, depth, duration, extent, risk scoring, population/infrastructure impact, confidence and feature importance. Model registry with versioning and MLflow tracking.

## Endpoints

| Method & Path | Description |
|---------------|-------------|
| `POST /api/v1/ai/predict/flood-risk` | Flood risk assessment from features |
| `GET /api/v1/ai/models` | Registered model list (versioned) |
| `GET /api/v1/ai/models/{id}/metrics` | Model evaluation metrics |
| `POST /api/v1/ai/retrain` | Queue a retraining job (202 Accepted) |

## Environment variables

| Variable | Example / default |
|----------|-------------------|
| `MODEL_DIR` | ../models/registry |
| `MODEL_VERSION` | v0.1-baseline |
| `MLFLOW_TRACKING_URI` |  |

## Run locally

```bash
cd services/ai
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8006
```

Swagger UI: http://localhost:8006/docs

## Run with Docker

```bash
cd services/ai
docker build -t floodwatch/ai .
docker run -p 8006:8006 floodwatch/ai
```

Or from the repo root: `docker compose up --build ai`

## Tests

```bash
cd services/ai
pip install pytest
pytest
```

## Optional heavy dependencies

Install only if this service needs them:

| Library | Purpose |
|---------|---------|
| `torch>=2.4` | Deep learning (PyTorch) |
| `torchvision>=0.19` | Vision models |
| `onnxruntime>=1.19` | Optimized inference |
| `optuna>=4.0` | Hyperparameter optimization |
| `catboost>=1.2` | Categorical boosting |

## Integration notes

- Swagger/OpenAPI: http://localhost:8006/docs
- All responses use the unified error envelope documented in docs/api/error-handling.md
