# SmartSplit

SmartSplit currently contains a React frontend and three FastAPI services:
authentication, user profiles, and groups/invitations.

## Local development

Configure `DATABASE_URL` and `SECRET_KEY` in each service's existing `.env`
file under `backend/services/<service-name>/`. Use the same `SECRET_KEY` and
`ALGORITHM` in all three services so every service can verify auth tokens.
Each service loads its `.env` relative to its own source, so it can be started
from its service directory.

Start one backend in each terminal from the repository root:

```powershell
cd backend/services/auth-service
..\..\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

```powershell
cd backend/services/user-service
..\..\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8002 --reload
```

```powershell
cd backend/services/group-service
..\..\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8003 --reload
```

Then start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Vite forwards `/auth` to port 8001, `/users` to port 8002, and `/groups` to
port 8003. The group service calls the user service at `USER_SERVICE_URL`,
which defaults to `http://127.0.0.1:8002`.

Each API exposes `/health` and `/docs`. Open the docs at ports 8001, 8002, and
8003 to inspect the auth, user, and group APIs respectively.

## Current scope

Expense tracking, settlement processing, Google sign-in, AI insights, and
notifications are listed as product ideas, but their backend services and
routes are not present in this repository yet.
