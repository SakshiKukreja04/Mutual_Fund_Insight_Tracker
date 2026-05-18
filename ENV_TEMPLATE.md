# Production Environment Variables Template

## Backend (.env) - NEVER COMMIT THIS FILE

Keep this file in `.gitignore` and update with your actual values on each deployment platform.

### Local Development
```env
PORT=5000
MONGO_URI=mongodb+srv://sakshikukreja:sakshi@cluster0.mcsk3re.mongodb.net/Aureva-Fund-Insight-Tracker?appName=Cluster0
MF_API_BASE_URL=https://api.mfapi.in
FRONTEND_URL=http://localhost:5173
```

### Production (Render)
```env
# Render automatically assigns PORT via environment
# Leave blank or set to a specific port number
PORT=

# Your MongoDB Atlas connection string
# Format: mongodb+srv://username:password@cluster.mongodb.net/dbname?appName=Cluster0
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/Aureva-Fund-Insight-Tracker?appName=Cluster0

# External API base URL (do not change)
MF_API_BASE_URL=https://api.mfapi.in

# Your frontend Vercel URL (update this after deploying frontend)
FRONTEND_URL=https://aureva-fund-tracker.vercel.app
```

**How to set in Render:**
1. Go to Render Dashboard
2. Select your service
3. Settings → Environment Variables
4. Add each variable separately
5. Click "Save Changes"

---

## Frontend (.env) - NEVER COMMIT THIS FILE

Keep this file in `.gitignore` and update with your backend URL.

### Local Development
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Production (Vercel)
```env
# Your Render backend URL (update this after deploying backend)
VITE_API_BASE_URL=https://aureva-fund-tracker.onrender.com/api
```

**How to set in Vercel:**
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add `VITE_API_BASE_URL` variable
5. Set value to your Render backend URL

---

## Database Setup (MongoDB Atlas)

1. Ensure cluster is created at https://mongodb.com/cloud/atlas
2. Get connection string:
   - Dashboard → Clusters → Connect
   - Choose "Drivers" → Node.js
   - Copy connection string
3. Replace USERNAME and PASSWORD:
   ```
   mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.mongodb.net/Aureva-Fund-Insight-Tracker?appName=Cluster0
   ```
4. Set in backend environment variables

### Network Access Configuration

For Render backend to access MongoDB Atlas:

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Enter `0.0.0.0/0` (allows all IPs)
4. Or find Render's outbound IP and add specifically

---

## Variable Descriptions

### Backend Variables

| Variable | Development | Production | Required |
|----------|-------------|-----------|----------|
| PORT | 5000 | Auto (Render) | Yes |
| MONGO_URI | Local MongoDB | MongoDB Atlas | Yes |
| MF_API_BASE_URL | https://api.mfapi.in | https://api.mfapi.in | Yes |
| FRONTEND_URL | http://localhost:5173 | https://vercel.app | Yes |

### Frontend Variables

| Variable | Development | Production | Required |
|----------|-------------|-----------|----------|
| VITE_API_BASE_URL | http://localhost:5000/api | https://onrender.com/api | Yes |

---

## Secrets Management Best Practices

1. **Never hardcode secrets** - Always use environment variables
2. **Don't commit .env files** - Ensure .gitignore includes .env
3. **Use strong passwords** - MongoDB username/password should be 12+ chars
4. **Rotate credentials periodically** - Update MongoDB password every 90 days
5. **Monitor access logs** - Check MongoDB Atlas access history
6. **Use different passwords** - Dev != Prod credentials
7. **Limit database permissions** - MongoDB user should have minimal required permissions

---

## Deployment Commands

### Deploy Backend to Render

```bash
# Automatic via GitHub (recommended)
# Push to main branch: Render auto-deploys

# Manual via CLI (optional)
# Render CLI: https://render.com/docs/deploy-cli
```

### Deploy Frontend to Vercel

```bash
# Automatic via GitHub (recommended)
# Push to main branch: Vercel auto-deploys

# Manual via CLI (optional)
# npm install -g vercel
# vercel --prod
```

---

## Verification Checklist

After setting environment variables in Render and Vercel:

### Backend (Render)
- [ ] PORT environment variable is set (or empty for auto)
- [ ] MONGO_URI is valid and password-encoded
- [ ] MF_API_BASE_URL is https://api.mfapi.in
- [ ] FRONTEND_URL matches your Vercel URL
- [ ] Service has "Auto-Deploy" enabled
- [ ] Check logs for errors after deployment

### Frontend (Vercel)
- [ ] VITE_API_BASE_URL matches your Render URL
- [ ] Build completes without errors
- [ ] Preview/production deployment works
- [ ] Network requests go to correct backend

### Database (MongoDB Atlas)
- [ ] Cluster is running
- [ ] Network whitelist allows Render IP
- [ ] Connection string is correct
- [ ] Database and collections exist

---

## Emergency Rollback

### If Backend Breaks
1. Render Dashboard → Deployments tab
2. Find last working deployment
3. Click "Redeploy"

### If Frontend Breaks
1. Vercel Dashboard → Deployments tab
2. Find last working deployment
3. Click "Rollback to this Deployment"

---

## Support Resources

- **Render Documentation:** https://render.com/docs
- **Vercel Documentation:** https://vercel.com/docs
- **MongoDB Atlas Help:** https://www.mongodb.com/docs/atlas/
- **Environment Variables Guide:** https://12factor.net/config

---

*Last Updated: 2025*  
*Keep this template secure and never share credentials*
