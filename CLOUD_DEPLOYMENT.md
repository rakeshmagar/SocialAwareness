# SocialConnect Cloud Deployment

This project is ready for the following deployment layout:

- **Frontend:** Vercel (React/Create React App)
- **Backend:** Railway (Node.js + Express)
- **Database:** TiDB Cloud (MySQL-compatible, accessed through Sequelize)

## 1. Repository layout

When this `socialconnect` folder is the root of the GitHub repository:

```text
socialconnect/
├── src/                 # React frontend
├── public/
├── package.json
├── vercel.json
└── backend/
    ├── src/             # Express backend
    ├── package.json
    ├── railway.json
    └── .env.example
```

Never commit real `.env` files or real passwords. The included `.gitignore` excludes them.

## 2. Create the TiDB Cloud database

1. Create a TiDB Cloud cluster/database.
2. In TiDB Cloud, open the connection dialog for the cluster.
3. Copy the host, port, database, username, and password shown there.
4. Use the public endpoint if Railway will connect over the public internet.
5. TLS is required for TiDB Cloud Starter/Essential public endpoints, so this project supports `DB_SSL=true`.

You do not need to create tables manually. On backend startup, Sequelize runs `sequelize.sync()` and creates the application tables if they are missing.

## 3. Deploy backend to Railway

1. Push this project to GitHub.
2. Create a new Railway project and deploy the GitHub repository.
3. In the Railway backend service, set **Root Directory** to:

```text
/backend
```

4. Railway should detect the Node.js app. The included `backend/railway.json` uses `npm start` and health check `/api/health`.
5. Add these Railway variables, replacing values with those from TiDB Cloud:

```env
NODE_ENV=production
FRONTEND_URL=https://YOUR-VERCEL-DOMAIN

DB_HOST=YOUR_TIDB_HOST
DB_PORT=4000
DB_NAME=YOUR_TIDB_DATABASE
DB_USER=YOUR_TIDB_USERNAME
DB_PASSWORD=YOUR_TIDB_PASSWORD
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true

JWT_SECRET=GENERATE_A_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=1d

ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@socialconnect.local
ADMIN_PASSWORD=USE_A_STRONG_UNIQUE_PASSWORD
```

Use the **actual port shown by TiDB Cloud** if it is not `4000`.

`PORT` does not need to be set on Railway. The server uses Railway's `PORT` automatically and falls back to `5000` locally.

6. Generate a public Railway domain for the backend.
7. Test:

```text
https://YOUR-RAILWAY-DOMAIN/api/health
https://YOUR-RAILWAY-DOMAIN/api/health/db
```

The expected database-health response is:

```json
{"status":"ok","database":"connected"}
```

## 4. Deploy frontend to Vercel

1. Import the same GitHub repository into Vercel.
2. Because the React app is at repository root, keep the Vercel Root Directory at `.`.
3. Vercel should detect Create React App. The included `vercel.json` builds with `npm run build` and serves the `build` directory.
4. In Vercel project environment variables, add:

```env
REACT_APP_API_URL=https://YOUR-RAILWAY-DOMAIN/api
```

5. Deploy the frontend.

## 5. Update backend CORS after Vercel gives you a domain

Return to Railway and set:

```env
FRONTEND_URL=https://YOUR-VERCEL-DOMAIN
```

Redeploy the backend after changing it.

For more than one allowed frontend (for example production plus a preview URL), use a comma-separated value:

```env
FRONTEND_URL=https://socialconnect.vercel.app,https://preview.example.com
```

## 6. Test the live application

1. Open the Vercel URL.
2. Register a normal account.
3. Log in.
4. Create a campaign or report.
5. Log in with the admin account configured in Railway.
6. Approve the campaign / manage reports.
7. Confirm `/api/health/db` still reports `connected`.

## 7. Local development remains supported

Frontend:

```bash
npm install
npm start
```

Backend (second terminal):

```bash
cd backend
npm install
npm run dev
```

Local backend `.env` example:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=social_awareness_db
DB_USER=root
DB_PASSWORD=YOUR_LOCAL_MYSQL_PASSWORD
DB_SSL=false
JWT_SECRET=YOUR_LOCAL_SECRET
JWT_EXPIRES_IN=1d
```

## 8. Environment files

- `.env.example` — frontend local example
- `.env.production.example` — Vercel frontend example
- `backend/.env.example` — local MySQL and TiDB/Railway examples

Do not put database passwords or JWT secrets in `REACT_APP_*` variables because React environment variables are included in browser-delivered code.
