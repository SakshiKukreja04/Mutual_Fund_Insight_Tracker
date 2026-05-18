# Aureva Fund Insight Tracker

A MERN stack application for tracking and analyzing Indian mutual funds with real-time NAV data and historical charting.

## Features

- **Fund Search**: Search for Indian mutual funds by name or code
- **Watchlist Management**: Add/remove funds to a personal watchlist
- **NAV Charts**: Interactive time-series charts for historical NAV data
- **Time Range Filtering**: View 1Y, 3Y, 5Y, or All historical data
- **Fund Statistics**: Display data points, latest NAV, highest, and lowest prices

## Architecture

### Backend (Express.js + Node.js)
- RESTful API with Express
- MongoDB Atlas for persistent storage
- MFapi.in integration for mutual fund data
- In-memory caching for API responses

### Frontend (React + Vite)
- React Router for navigation
- Recharts for data visualization
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

## Technical Implementation

### NAV Data Processing

NAV data from MFapi.in is parsed defensively because dates are returned in `dd-mm-yyyy` format and NAV values are strings. The frontend:
1. Validates input is an array
2. Splits dates by "-" character
3. Converts dates from dd-mm-yyyy to yyyy-mm-dd format
4. Converts NAV strings to floating-point numbers
5. Removes invalid records (malformed dates or NAV values)
6. Sorts data from oldest to newest before rendering the chart

Example transformation:
```js
// Input from MFapi.in
{ date: "16-05-2025", nav: "103.4567" }

// Output from parseNavData
{ date: "2025-05-16", nav: 103.4567, timestamp: Date object }
```

### Backend Caching

Historical NAV API responses are cached in-memory on the backend for 1 hour to reduce repeated calls to MFapi.in:
- First request for a fund → calls MFapi.in
- Subsequent requests within 1 hour → returns cached response
- After 1 hour → calls MFapi.in again and updates cache

Cache key: `schemeCode` (e.g., "150750")
Cache duration: 3,600,000 milliseconds (1 hour)

### Range Filtering

Time range filters (1Y, 3Y, 5Y, All) work by:
1. Calculating the cutoff date based on the selected range from the current date
2. Filtering the parsed NAV data to include only dates >= cutoff date
3. Re-rendering the chart with the filtered data

## Setup

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

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
MF_API_BASE_URL=https://api.mfapi.in
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Default Search Keywords

- **Fund Families**: HDFC, ICICI, Axis, SBI, Aditya Birla, Reliance, DSP, Franklin, NIPPON, IDFC
- **Fund Types**: Large Cap, Mid Cap, Small Cap, Balanced, Debt, Liquid, Gold, Tax Saver, Index
- **Example Searches**: "HDFC Growth", "SBI Technology", "Axis Bluechip"

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

## Notes

- MFapi.in provides free historical NAV data for Indian mutual funds
- MongoDB Atlas used for persistent watchlist storage
- Frontend runs on port 5173 (Vite default)
- Backend runs on port 5000
- CORS enabled for frontend origin
