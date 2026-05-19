# Aureva Fund Insight Tracker

A MERN stack application for tracking and analyzing Indian mutual funds with real-time NAV data and historical charting.

## Live URLs

- **Frontend**: https://mutual-fund-insight-tracker-l24y.vercel.app
- **Backend**: https://mutual-fund-insight-tracker.onrender.com
- **API Base**: https://mutual-fund-insight-tracker.onrender.com/api

## Tech Stack

- **Frontend**: React, Vite, Recharts
- **Backend**: Express.js, Node.js
- **Database**: MongoDB Atlas
- **External API**: MFapi.in

## Features

- **Search Indian Mutual Funds**: Search funds by name or code
- **Add Funds to Watchlist**: Save favorite funds for easy tracking
- **Remove Funds from Watchlist**: Manage your watchlist
- **View NAV Growth Chart**: Interactive historical NAV visualization
- **Range Filters**: View data for 1Y, 3Y, 5Y, or All periods
- **Fund Statistics**: Latest NAV, highest/lowest prices, data point counts

## Architecture

### Backend (Express.js + Node.js)
- RESTful API with Express middleware
- MongoDB Atlas for persistent storage
- MFapi.in integration with backend proxy pattern
- In-memory caching (1-hour TTL) for API responses

### Frontend (React + Vite)
- React Router for navigation
- Recharts for interactive data visualization
- Axios for HTTP requests
- Responsive CSS design

## API Endpoints

### Search
- `GET /api/search?q={query}` - Search funds by name or code

### Watchlist
- `GET /api/watchlist` - Fetch user's watchlist
- `POST /api/watchlist` - Add fund to watchlist
- `DELETE /api/watchlist/{schemeCode}` - Remove fund from watchlist

### Fund Details
- `GET /api/funds/{schemeCode}` - Fetch fund NAV history and metadata

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Aureva-Fund-Insight-Tracker
MF_API_BASE_URL=https://api.mfapi.in
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
```

**For Local Development:**
```
FRONTEND_URL=http://localhost:5173
```

**For Render Deployment:**
```
FRONTEND_URL=https://mutual-fund-insight-tracker-l24y.vercel.app
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://mutual-fund-insight-tracker.onrender.com/api
```

**For Local Development:**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

See [ENV_TEMPLATE.md](ENV_TEMPLATE.md) for template with detailed instructions.

## Run Locally

### Prerequisites
- Node.js v16+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend Setup
```bash
cd backend
npm install
# Create .env file with configuration (see Environment Variables section)
npm start          # Production mode
# OR
npm run dev        # Development mode with auto-reload
```

Backend runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
# Create .env file with configuration (see Environment Variables section)
npm run dev        # Development server with Vite
```

Frontend runs on `http://localhost:5173`

### Testing Locally
1. Start backend: `npm start` in `backend/` folder
2. Start frontend: `npm run dev` in `frontend/` folder
3. Open `http://localhost:5173` in browser
4. Search for funds and test all features

---

## Deployment Guide

### Deploy Backend to Render

1. **Create Render Account** - Go to [render.com](https://render.com)
2. **Create New Web Service**
   - Connect your GitHub repository
   - Select `backend` directory as root
   - Set Build Command: `npm install`
   - Set Start Command: `npm start`
3. **Add Environment Variables** in Render Dashboard:
   - `PORT`: 5000
   - `MONGO_URI`: Your MongoDB connection string
   - `MF_API_BASE_URL`: https://api.mfapi.in
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., https://your-app.vercel.app)
4. **Deploy** - Click Deploy button
5. **Get Render URL** - Note the service URL (e.g., https://mutual-fund-insight-tracker.onrender.com)

### Deploy Frontend to Vercel

1. **Create Vercel Account** - Go to [vercel.com](https://vercel.com)
2. **Import Project**
   - Select your GitHub repository
   - Select `frontend` directory as root
3. **Configure Build Settings**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add Environment Variables**
   - `VITE_API_BASE_URL`: https://mutual-fund-insight-tracker.onrender.com/api
5. **Deploy** - Click Deploy button
6. **Get Vercel URL** - Note your deployment URL

### Update Backend After Frontend Deployment

After frontend is deployed on Vercel:

1. Update `backend/.env`:
   ```
   FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
   ```
2. Push to GitHub
3. Trigger redeploy on Render (Manual Deploy button)

---

## Run Locally

### Prerequisites
- Node.js v16+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend Setup
```bash
cd backend
npm install
# Create .env file with configuration (see Environment Variables section)
npm start          # Production mode
# OR
npm run dev        # Development mode with auto-reload
```

Backend runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
# Create .env file with configuration (see Environment Variables section)
npm run dev        # Development server with Vite
```

Frontend runs on `http://localhost:5173`

### Testing Locally
1. Start backend: `npm start` in `backend/` folder
2. Start frontend: `npm run dev` in `frontend/` folder
3. Open `http://localhost:5173` in browser
4. Search for funds and test all features

## Technical Implementation

### NAV Data Processing

NAV data from MFapi.in is parsed defensively because dates are returned in `dd-mm-yyyy` format and NAV values are strings:

1. Validates input is an array
2. Splits dates by "-" character
3. Converts dates from dd-mm-yyyy to yyyy-mm-dd format
4. Converts NAV strings to floating-point numbers
5. Removes invalid records (malformed dates or NAV values)
6. Sorts data from oldest to newest before rendering

Example transformation:
```js
// Input from MFapi.in
{ date: "16-05-2025", nav: "103.4567" }

// Output from parseNavData
{ date: "2025-05-16", nav: 103.4567, timestamp: Date object }
```

### Backend Caching

Historical NAV API responses cached in-memory for 1 hour:
- First request → calls MFapi.in
- Subsequent requests (within 1 hour) → returns cached response
- After 1 hour → calls MFapi.in again and updates cache

### Range Filtering

Time range filters (1Y, 3Y, 5Y, All) work by:
1. Calculating cutoff date based on selected range from current date
2. Filtering parsed NAV data to include only dates >= cutoff date
3. Re-rendering chart with filtered data

## Data Flow

1. **Search**
   - User enters fund name/code
   - Frontend calls `GET /api/search?q={query}`
   - Backend proxies to MFapi.in
   - Results displayed in search page

2. **Add to Watchlist**
   - User clicks "Add to Watchlist"
   - Frontend calls `POST /api/watchlist` with schemeCode and schemeName
   - Backend stores in MongoDB
   - Success alert shown to user

3. **View Fund Details**
   - User clicks "View Details" on fund card
   - Frontend navigates to `/fund/{schemeCode}`
   - Frontend calls `GET /api/funds/{schemeCode}`
   - Backend returns cached or fresh NAV data
   - parseNavData processes the response
   - Chart renders with 5Y default filter

4. **Change Time Range**
   - User clicks 1Y/3Y/5Y/All button
   - filterDataByRange recalculates filtered data
   - Chart re-renders with new data

## Assumptions

- **Single Shared Watchlist**: No user authentication - all users share the same watchlist
- **Backend Proxy Pattern**: Fund details fetched via backend API (not directly from MFapi.in)
- **NAV Data Format**: MFapi.in returns dates as `dd-mm-yyyy` strings and NAV as string values
- **Data Sorting**: NAV data sorted defensively to handle edge cases and malformed entries
- **In-Memory Cache**: 1-hour TTL cache for NAV data to reduce API calls to MFapi.in
- **CORS Handling**: Backend CORS configured to allow requests from deployed Vercel frontend

## Known Limitations

### Current Limitations
- **No Authentication**: Single watchlist shared across all users (no login system)
- **External API Dependency**: Search and fund data depend on MFapi.in availability
- **Render Sleep Mode**: Render free tier services sleep after 15 minutes of inactivity (first request may be slow)
- **Limited Historical Data**: Historical NAV data availability depends on MFapi.in
- **No Pagination**: Large search results may take time to load
- **In-Memory Cache**: Cache lost on server restart (not persistent)
- **Case Sensitivity**: Watchlist operations require exact scheme code matching

### Future Improvements
- User authentication and per-user watchlists
- Database-backed caching for persistent cache
- Search result pagination and filtering
- Real-time price alerts
- Portfolio analysis and returns calculation
- Export watchlist to CSV/PDF

## Default Search Keywords

- **Fund Families**: HDFC, ICICI, Axis, SBI, Aditya Birla, Reliance, DSP, Franklin, NIPPON, IDFC
- **Fund Types**: Large Cap, Mid Cap, Small Cap, Balanced, Debt, Liquid, Gold, Tax Saver, Index
- **Example Searches**: "HDFC Growth", "SBI Technology", "Axis Bluechip"

## Dependencies

**Backend**
- express: HTTP framework
- mongoose: MongoDB ODM
- axios: HTTP client
- cors: Cross-origin resource sharing
- dotenv: Environment variables

**Frontend**
- react: UI library
- react-router-dom: Client-side routing
- axios: HTTP client
- recharts: Data visualization
- lucide-react: Icons (optional)

## Deployment

### Backend: Render.com
```bash
# Environment variables in Render dashboard:
PORT=
MONGO_URI=your_connection_string
MF_API_BASE_URL=https://api.mfapi.in
FRONTEND_URL=https://mutual-fund-insight-tracker-l24y.vercel.app
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment steps.

## Security

- All credentials stored in environment variables, never in source code
- .env files excluded from git via .gitignore
- CORS restricted to frontend origin
- Input validation on all API endpoints
- Error messages generic (no sensitive data exposure)

See [SECURITY_AUDIT.md](SECURITY_AUDIT.md) for complete security audit.

## Notes

- MFapi.in provides free historical NAV data for Indian mutual funds
- MongoDB Atlas auto-backs up data
- Frontend runs on port 5173 (Vite default)
- Backend runs on port 5000 (or Render's assigned port)
- CORS enabled for frontend origin only
