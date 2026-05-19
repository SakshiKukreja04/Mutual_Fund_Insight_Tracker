# Aureva Fund Insight Tracker

A MERN stack application for tracking and analyzing Indian mutual funds with real-time NAV data and historical charting.

**Live URL:** https://your-vercel-url.vercel.app

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
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

See [ENV_TEMPLATE.md](ENV_TEMPLATE.md) for template with detailed instructions.

## Run Locally

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`  
Frontend runs on `http://localhost:5173`

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

- Single shared watchlist (no user authentication)
- Fund details fetched via backend proxy (not directly from MFapi.in)
- NAV data sorted defensively to handle edge cases
- No user accounts or authentication system

## Known Limitations

- No user accounts or authentication
- Search depends on MFapi.in availability
- Render free tier may sleep after 15 minutes of inactivity
- Historical NAV data limited by MFapi.in availability
- Single watchlist shared across all users

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
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend: Vercel.com
```bash
# Environment variables in Vercel dashboard:
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
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
