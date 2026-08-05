# Changelog

## 1.0.0 (2026-08-05)


### Features

* replace Docker with WSL2 native services ([b3b7d30](https://github.com/ismahdeismail-beep/Floodwatch-/commit/b3b7d303cdcca49bd06218a97a2f34630f0f6b64))
* **shared:** add floodwatch-shared package with JSON logging ([968729a](https://github.com/ismahdeismail-beep/Floodwatch-/commit/968729a629152c3f2d966be2b15f45fff9c243ca))
* **shared:** add request-id ASGI middleware ([dfc21ce](https://github.com/ismahdeismail-beep/Floodwatch-/commit/dfc21ce4ce95f08a9ae9d943b10005e1755df647))
* **shared:** redis-backed cache helper with tenacity retries ([2498e6a](https://github.com/ismahdeismail-beep/Floodwatch-/commit/2498e6a1f4aa82dd9be24b66d993a8bfb91192c7))
* **shared:** standard health and readiness routers ([3e78088](https://github.com/ismahdeismail-beep/Floodwatch-/commit/3e78088b919629c2620645d29d49878b7cb03acd))
* **shared:** unified ApiError envelope with exception handlers ([a74e8b1](https://github.com/ismahdeismail-beep/Floodwatch-/commit/a74e8b1dcc3844d307584b38c16f2b178f86d752))
* **weather:** adopt shared logging, health, error envelope; fix CI ([5334485](https://github.com/ismahdeismail-beep/Floodwatch-/commit/5334485f2c4a2e887bdfbd47c55b3c76728b1836))


### Bug Fixes

* **deploy:** add vercel.json pointing Vercel at apps/web (Next.js monorepo) ([a286b38](https://github.com/ismahdeismail-beep/Floodwatch-/commit/a286b3821fb6ccda068153869e9b95ceb928238c))
* **deploy:** drop rootDirectory from vercel.json (not a valid field); framework only ([2c616c5](https://github.com/ismahdeismail-beep/Floodwatch-/commit/2c616c517ae5e05abe9d4b21244fea4d2351effb))
* drop Windows-only binaries from root deps to unblock Linux/Vercel installs ([aef90c7](https://github.com/ismahdeismail-beep/Floodwatch-/commit/aef90c7834a064b57bbaeff2543893b7386a6e24))
