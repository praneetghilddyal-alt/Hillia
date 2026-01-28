# HILLIA Deployment Guide
## Vercel (Frontend) + Railway (Backend) + MongoDB Atlas

---

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Vercel      │────▶│    Railway      │────▶│  MongoDB Atlas  │
│  React Frontend │     │ FastAPI Backend │     │    Database     │
│   (Port 443)    │     │   (Port 8001)   │     │   (Port 27017)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
       HTTPS                  HTTPS                   TLS
```

---

## Step 1: MongoDB Atlas Setup

### 1.1 Create Cluster
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free account → Create cluster (M0 Free tier)
3. Choose region closest to your users

### 1.2 Create Database User
1. Security → Database Access → Add New Database User
2. Authentication: Password
3. Username: `hillia_prod` (example)
4. Password: Generate secure password (save it)
5. Role: `readWriteAnyDatabase`

### 1.3 Configure Network Access
1. Security → Network Access → Add IP Address
2. For Railway: Add `0.0.0.0/0` (Railway uses dynamic IPs)
3. Click Confirm

### 1.4 Get Connection String
1. Deployment → Database → Connect
2. Choose "Connect your application"
3. Copy connection string:
   ```
   mongodb+srv://hillia_prod:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password

---

## Step 2: Railway Backend Setup

### 2.1 Create Project
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Select your repository
4. Choose `/backend` as root directory

### 2.2 Configure Build
Railway should auto-detect Python. If not, add:

**railway.json** (in /backend):
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn server:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### 2.3 Set Environment Variables
In Railway Dashboard → Variables:

| Variable | Value |
|----------|-------|
| `MONGO_URL` | `mongodb+srv://hillia_prod:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority` |
| `DB_NAME` | `hillia_production` |
| `CORS_ORIGINS` | `https://your-app.vercel.app` |
| `ADMIN_USERNAME` | `your_chosen_username` |
| `ADMIN_PASSWORD_HASH` | `(see below)` |

### 2.4 Generate Admin Password Hash
Run locally:
```bash
python3 -c "import hashlib; print(hashlib.sha256('YOUR_SECURE_PASSWORD'.encode()).hexdigest())"
```
Use the output as `ADMIN_PASSWORD_HASH`.

### 2.5 Deploy & Get URL
1. Railway auto-deploys on push
2. Settings → Domains → Generate Domain
3. Note your backend URL: `https://hillia-backend-production.up.railway.app`

---

## Step 3: Vercel Frontend Setup

### 3.1 Create Project
1. Go to [vercel.com](https://vercel.com)
2. New Project → Import from GitHub
3. Select your repository
4. Set Root Directory: `frontend`

### 3.2 Configure Build Settings
| Setting | Value |
|---------|-------|
| Framework Preset | Create React App |
| Build Command | `yarn build` |
| Output Directory | `build` |
| Install Command | `yarn install` |

### 3.3 Set Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `REACT_APP_BACKEND_URL` | `https://hillia-backend-production.up.railway.app` |

### 3.4 Deploy
1. Click Deploy
2. Note your frontend URL: `https://hillia.vercel.app`

---

## Step 4: CORS Configuration

### 4.1 Update Railway Backend
Go back to Railway and update:
```
CORS_ORIGINS=https://hillia.vercel.app
```

For multiple origins (if needed):
```
CORS_ORIGINS=https://hillia.vercel.app,https://www.hillia.in
```

### 4.2 Redeploy Backend
Railway will auto-redeploy when environment variables change.

---

## Step 5: SSL Verification

### 5.1 Verify HTTPS
Both Vercel and Railway provide automatic SSL:

```bash
# Test frontend SSL
curl -I https://hillia.vercel.app

# Test backend SSL
curl -I https://hillia-backend-production.up.railway.app/api/
```

Expected: `HTTP/2 200` with valid SSL certificate.

### 5.2 Check Certificate
```bash
echo | openssl s_client -connect hillia.vercel.app:443 2>/dev/null | openssl x509 -noout -dates
```

---

## Step 6: Custom Domain (Optional)

### 6.1 Vercel Custom Domain
1. Vercel → Project → Settings → Domains
2. Add `hillia.in` (or your domain)
3. Configure DNS:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `cname.vercel-dns.com`

### 6.2 Railway Custom Domain
1. Railway → Project → Settings → Domains
2. Add `api.hillia.in`
3. Configure DNS as instructed

### 6.3 Update CORS After Custom Domain
```
CORS_ORIGINS=https://hillia.in,https://www.hillia.in
```

---

## Step 7: Production Hardening Checklist

### Security
- [ ] Admin credentials set via environment variables only
- [ ] No default/sample credentials in codebase
- [ ] CORS restricted to production domain only
- [ ] MongoDB network access limited (or uses Railway's private network)
- [ ] Rate limiting enabled on admin endpoints (built-in)
- [ ] HTTPS enforced on all endpoints (automatic)

### Monitoring
- [ ] Railway logs accessible for backend errors
- [ ] Vercel analytics enabled (optional)
- [ ] MongoDB Atlas monitoring enabled (free tier includes basics)

### Backup
- [ ] MongoDB Atlas backups enabled (free tier: daily snapshots)
- [ ] GitHub repo is source of truth for code

### Performance
- [ ] MongoDB indexes created for frequent queries (automatic for `_id`)
- [ ] Frontend assets served via Vercel CDN (automatic)

---

## Step 8: Post-Deploy Testing

### 8.1 Health Check
```bash
# Backend health
curl https://your-backend.up.railway.app/api/

# Expected: {"message":"HILLIA Governance Backend","version":"0.1.0"}
```

### 8.2 Admin Auth Test
```bash
curl -X POST https://your-backend.up.railway.app/api/admin/auth/verify \
  -u "YOUR_USERNAME:YOUR_PASSWORD"

# Expected: {"status":"authenticated","username":"YOUR_USERNAME"}
```

### 8.3 Frontend Test
1. Visit `https://your-app.vercel.app`
2. Click invitation card → should navigate to Philosophy
3. Complete questionnaire → should submit successfully
4. Visit `/admin/login` → should authenticate with your credentials

---

## Environment Variables Summary

### Railway (Backend)
```
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=hillia_production
CORS_ORIGINS=https://your-frontend-domain.com
ADMIN_USERNAME=<your_username>
ADMIN_PASSWORD_HASH=<sha256_hash_of_password>
```

### Vercel (Frontend)
```
REACT_APP_BACKEND_URL=https://your-backend.up.railway.app
```

---

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGINS` exactly matches your frontend URL (including `https://`)
- No trailing slash
- Redeploy backend after changing

### MongoDB Connection Failed
- Check connection string format
- Verify password is URL-encoded if it contains special characters
- Confirm IP `0.0.0.0/0` is allowed in Atlas Network Access

### Admin Login Returns 503
- `ADMIN_USERNAME` or `ADMIN_PASSWORD_HASH` not set
- Check Railway environment variables

### Frontend Shows Blank
- Check browser console for errors
- Verify `REACT_APP_BACKEND_URL` is set correctly in Vercel

---

## Cost Estimate (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| MongoDB Atlas | M0 (Free) | $0 |
| Railway | Starter | ~$5-10 |
| Vercel | Hobby | $0 |
| **Total** | | **~$5-10/month** |

---

## Next Steps After Deployment

1. **Quiet testing** — Test all flows before announcing
2. **Security review** — Verify no exposed credentials
3. **Monitor logs** — Watch Railway logs for first 24-48 hours
4. **Analytics decision** — Activate GA/Meta when ready for traffic
