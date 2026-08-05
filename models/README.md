# Models

Model artifacts and registry for FloodWatch AI.

## Layout

| Path | Contents |
|------|----------|
| `registry/` | Local model artifact store (git-ignored). Mirrors the MLflow artifact store. |
| `experiments/` | (future) Experiment notebooks and configs |

## Lifecycle

1. **Train** — experiments tracked in MLflow (params, metrics, artifacts).
2. **Register** — best run registered in the MLflow model registry.
3. **Promote** — set stage to `Production` (requires beating the baseline and
   current production model on precision/recall — see ADR-006).
4. **Serve** — `services/ai` serves the production-stage model; responses include
   `modelVersion`.

## Baseline

- **`v0.1.0`** — deterministic sigmoid-weighted composite (precipitation 72 h,
  upstream gauge stage, soil moisture proxy, terrain index). This is the serving
  default until a trained ML model is promoted.

## Conventions

- Model binaries, weights, and checkpoints are **never committed to Git**.
- Each model directory/run records: code SHA, dataset hash, environment image,
  seed, metrics, and promotion date.
- `models/registry/.gitkeep` preserves the directory in Git.
