## Deployment Guide

This repo splits frontend and backend deployments:

- Frontend: GitHub Pages (static)
- Backend: Render or Railway (Node API)

### Prereqs
- Create a GitHub repo and push the code.
- Decide your backend host URL (Render/Railway) — needed as `VITE_API_BASE_URL`.

### Backend (Render example)
1) Create new **Web Service** on Render, connect this repo, set root to `backend/`.
2) Build command: `npm ci && npm run build`
3) Start command: `npm run start`
4) Env vars: `PORT=4000`
5) Deploy; note the public URL (e.g., `https://your-api.onrender.com`). CORS is open.

Railway: similar setup — project from repo, root `backend`, build `npm ci && npm run build`, start `npm run start`, set `PORT=4000`.

### Frontend (GitHub Pages)
1) In repo Settings → Pages: set source to GitHub Actions.
2) Add secret `VITE_API_BASE_URL` with your backend URL (include `/api`, e.g., `https://your-api.onrender.com/api`).
3) Workflow: `.github/workflows/deploy-frontend.yml` already builds and publishes `frontend/dist` on push to `main/master` or manual dispatch.
4) After deploy, Pages URL will be `https://<username>.github.io/<repo>/`. Frontend fetches the backend using `VITE_API_BASE_URL`.

### Local Dev
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev` (uses `http://localhost:4000/api` by default)

### Notes
- Pagination and filters work when more than `pageSize` todos exist (default 10).
- Past-due dates are blocked client and server side.
- Errors surface via the Snackbar; per-field messages show inline for required fields.
