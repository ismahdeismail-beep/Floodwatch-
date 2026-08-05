# AI Development Environment

This document defines the machine-learning development environment for the
FloodWatch AI platform: toolchain, hardware, experiment workflow, and
reproducibility requirements.

## ML Toolchain

| Layer | Tools |
|-------|-------|
| Core libraries | PyTorch, scikit-learn, XGBoost, LightGBM, CatBoost |
| Feature/data | pandas, GeoPandas, xarray, rioxarray, rasterio, GDAL, Shapely, OSMnx |
| Experiment tracking | MLflow (tracking + model registry) |
| Hyperparameters | Optuna |
| Serving | ONNX Runtime, FastAPI (`services/ai`) |
| Climate-AI evaluation track | GraphCast, Pangu-Weather, FourCastNet (evaluated as forecast backbones) |

## Environments

| Environment | Use | Specification |
|-------------|-----|---------------|
| Local dev | Feature work, small experiments | Python 3.12 venv or devcontainer (`.devcontainer/`) |
| Training sandbox | Medium experiments | 1× NVIDIA GPU (T4/A10 class), 32 GB RAM, 100 GB disk |
| Training cluster (post-pilot) | Production retraining | 4–8× NVIDIA A100/H100, MLOps pipeline (Vertex AI Training ready) |

The devcontainer (`infrastructure/../.devcontainer/devcontainer.json`) provisions
Node 22, Python 3.12, Docker-in-Docker, and the ML toolchain for consistent
reproducible development.

## Dataset Versioning

- Raw datasets live under `datasets/raw/` (git-ignored; `.gitkeep` committed).
- Processed/feature datasets under `datasets/processed/`.
- Geospatial layers under `datasets/geodata/`.
- Historical flood records under `datasets/historical_floods/`.
- Every dataset has a `sources.json`/README recording provenance, license, and
  fetch script (`scripts/fetch-demo-data.py`).

## Model Versioning

- All model artifacts are versioned in the MLflow registry (see ADR-006).
- Code-level versions are stored in `models/registry/` (git-ignored) with
  `models/README.md` describing the promotion workflow.
- Baseline `v0.1.0` (deterministic sigmoid composite) is the serving default
  until a trained model beats it on precision/recall.

## Experiment Workflow

1. **Formulate** — define the prediction task (target, lead time, spatial scope).
2. **Data** — assemble features from `datasets/processed`, log dataset hash in MLflow.
3. **Train** — run training script; MLflow logs params, metrics, and artifacts.
4. **Evaluate** — holdout + time-series cross-validation; compare against baseline
   and current production model.
5. **Promote** — register the winning run in MLflow, set stage → Production.
6. **Serve** — the `ai` service picks up the new production model on next deploy/rollout.

## Reproducibility

- Pin Python deps per experiment (`requirements-lock.txt` when training).
- Record: code commit SHA, dataset hash, environment image tag, random seed.
- Never commit model binaries or raw data to Git (see `.gitignore`).

## Serving Constraints (ai service)

- `POST /api/v1/ai/predict` must return in < 5 minutes end-to-end (PRD target);
  the baseline runs in < 2 s.
- Responses include `modelVersion` and `confidence` for explainability.
- Feature importance must be returned to support decision intelligence and
  user-facing explanations.
