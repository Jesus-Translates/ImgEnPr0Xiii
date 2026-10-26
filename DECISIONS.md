# Implementation Decisions & Action Plan

## 1️⃣ Deployment of the Python Inference Server
- **Development**: Run locally with **uvicorn** (`python -m uvicorn python_server.handler:app --reload`). This allows rapid iteration and easy debugging.
- **Production**: Deploy as a **Vercel Serverless Function** written in **FastAPI**. Vercel supports Python serverless routes under `api/` – the file `api/python_server.py` will be auto‑detected and executed in a stateless environment. For heavy model loading we can use the `@vercel/python` runtime with a cold‑start warm‑up script.
- **Alternative**: If model size exceeds Vercel limits, move the inference service to a lightweight container on **Google Cloud Run** or **Fly.io** and proxy requests from the Next.js frontend (environment variable `PY_SERVER_URL` will point to that endpoint).

## 2️⃣ SQLite Persistence
- **Local dev**: Use a file‑based DB at `db/images.db` (initialized via `db/seed.sql`).
- **Vercel production**: Serverless functions have an **ephemeral filesystem**, so a persistent SQLite file is not viable. Options:
  1. **External DB** – e.g., **Supabase** (PostgreSQL) or **PlanetScale** (MySQL) accessed via an ORM like `prisma` or `knex`.
  2. **Vercel KV / Edge Store** – store metadata; upload raw image binaries to **Vercel Blob** (or S3) and keep only references in the DB.
- **Recommended** for now: keep SQLite locally for testing and add a **Supabase** connection stub in the code (`process.env.SUPABASE_URL`, `process.env.SUPABASE_ANON_KEY`). Workers can later swap the SQLite DAO with a Supabase client.

## 3️⃣ Security / API‑Key Handling
- The inference endpoint (`/generate`) should be **protected** in production.
- Recommended approaches:
  1. **Bearer Token** – set `process.env.INFERENCE_API_TOKEN` and verify it in the FastAPI route.
  2. **JWT** – issue short‑lived JWTs from the Next.js API layer.
  3. **Rate limiting** – via Vercel Edge Middleware.
- For the initial scaffold we will **skip auth** (to keep the flow simple) but add a placeholder check that reads `INFERENCE_API_TOKEN` and returns `401` if missing when `NODE_ENV === "production"`.

---
## Action Items for Workers
- **Worker 1**: Create `python_server/handler.py` (FastAPI) with a placeholder `/generate` that returns a static base64‑encoded PNG (or uses `diffusers` if a model key is provided). Include env var handling for `PY_SERVER_URL` and optional `INFERENCE_API_TOKEN`.
- **Worker 2**: Update Next.js API to read `PY_SERVER_URL` (already present) and add a runtime check for the token placeholder.
- **Worker 3**: Add a script `scripts/init_db.sh` that runs `sqlite3 db/images.db < db/seed.sql` for local dev and a stub for Supabase connection.
- **AdversarialWorker**: Review the implementations, verify that:
  * Local dev works (`npm run dev` → generate → view in gallery).
  * Production‑ready placeholders (env vars, auth check) are present.
  * No hard‑coded secrets are in the repo.

When all checks pass, the Lead Tech Manager will mark the project **functional (except for missing external API keys)**.
