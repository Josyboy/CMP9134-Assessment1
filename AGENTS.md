# Base44 sandbox setup notes

Non-obvious things learned while bringing this project up in the Base44 sandbox
(dev environment lives in `docker-compose.base44.yml`, metadata in
`.base44/environment.json`).

## Running it

```bash
docker compose -f docker-compose.base44.yml up -d --build   # start everything
docker compose -f docker-compose.base44.yml logs -f web api # tail app logs
docker compose -f docker-compose.base44.yml exec -T api npm test  # backend tests
```

| service   | image                                   | host port | container port | role                                  |
| --------- | --------------------------------------- | --------- | -------------- | ------------------------------------- |
| web       | `node:22-alpine` (source bind-mounted)  | 3000      | 2500           | Vite dev server — preview entry point |
| api       | `node:22-alpine` (source bind-mounted)  | 8000      | 3500           | Express API                           |
| robot-api | prebuilt `cmp9134_2526_robotsim`        | 5001      | 5000           | Third-party robot simulator           |
| mongo     | `mongo:7`                               | —         | 27017          | Database (internal only)              |

## Quirks worth knowing

- **The repo's own `docker-compose.yml` is not usable for development**: it builds
  the production Dockerfiles (`COPY . .` + `npm start` / `vite`, i.e. frozen code,
  no live reload) and it points the API at a remote MongoDB Atlas cluster whose
  credentials are committed in the file. `docker-compose.base44.yml` replaces it
  for sandbox work only; the original file is untouched.
- **MongoDB runs locally** (`mongodb://mongo:27017/gcs`). The committed Atlas URI is
  an external dependency; set `MONGO_URI` in the compose file if you specifically
  want the remote cluster.
- **`nodemon` is missing from `backend`'s devDependencies** even though the `dev`
  script calls it, so `npm run dev` fails after `npm ci`. The compose command uses
  Node 22's built-in watcher (`node --watch src/server.js`) instead.
- **No external credentials are required** — the robot simulator is a public GHCR
  image and Mongo is local. Nothing is read from `/run/base44/app.env`.
- **Frontend env vars must be browser-reachable URLs**, because the browser (not a
  container) calls them: `VITE_API_BASE_URL=https://8000-$BASE44_PUBLIC_HOST_SUFFIX`
  and `VITE_TELEMETRY_WS_URL=wss://5001-$BASE44_PUBLIC_HOST_SUFFIX`. Telemetry must
  be `wss://` since the preview is served over HTTPS (mixed content blocks `ws://`).
  Both are consumed at Vite startup, so a change needs a `web` service restart.
- **Vite host allowlist**: the preview proxy sends a rotating sandbox id as the Host
  header, so `frontend/vite.config.ts` appends `.<BASE44_SANDBOX_HOST_DOMAIN>` to
  `server.allowedHosts` only when `BASE44_PREVIEW_MODE === "1"`. With the flag
  unset the config behaves exactly as before (no `allowedHosts` key).
- API CORS is wide open (`cors()` with no options) and auth is a bearer token in
  `localStorage`, so no cookie/session cross-origin wiring is needed.
- **Healthchecks must use `127.0.0.1`, not `localhost`.** In `node:22-alpine`,
  `localhost` resolves to `::1` first and Vite only binds IPv4 (`0.0.0.0`), so
  `wget http://localhost:2500/` gets "Connection refused" inside the `web`
  container even while the dev server serves fine on the host port. The `api`
  check works either way (Node listens dual-stack), but keep both on `127.0.0.1`.
- Page metadata uses `react-helmet-async` (supports React 19). The unused
  `react-helmet` dependency was removed because its `react-side-effect`
  dependency required React 16–18 and emitted peer-resolution warnings.

## Verifying it works

```bash
curl -s http://localhost:3000/ | grep -q '@vite/client'   # dev server, live source
curl -s http://localhost:8000/                            # {"success":true,"message":"Hello world"}

# full authenticated path (auth + mongo + robot simulator together)
curl -s -X POST http://localhost:8000/api/auth/signup -H 'Content-Type: application/json' \
  -d '{"forename":"Preview","email":"preview@example.com","password":"preview123"}'
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/signin -H 'Content-Type: application/json' \
  -d '{"email":"preview@example.com","password":"preview123"}' | python3 -c 'import sys,json;print(json.load(sys.stdin)["token"])')
curl -s http://localhost:8000/api/robot/status -H "Authorization: Bearer $TOKEN"
```

In the UI: sign up / log in → dashboard shows robot status and live telemetry from
the simulator → move / reset the robot → audit log records the action.

- Backend tests are self-contained (`mocks/node-fetch.js` + jest module mocks) and
  need no database: `docker compose -f docker-compose.base44.yml exec -T api npm test`
  (9 tests). There is no frontend test suite.
- The robot simulator's own API docs are at `http://localhost:5001/docs`.
