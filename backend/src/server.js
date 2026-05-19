/*
Build the main Express server for a MERN mutual fund watchlist project.

Requirements:
1. Import express, cors, dotenv.
2. Load environment variables using dotenv.config().
3. Create an Express app.
4. Use express.json() middleware.
5. Configure CORS:
   - Allow origin from process.env.FRONTEND_URL
   - If FRONTEND_URL is not available, allow http://localhost:5173
   - Allow methods GET, POST, DELETE, PUT, OPTIONS
   - Allow credentials false
6. Import connectDB from ./config/db.js and call it before starting the server.
7. Import these route files:
   - ./routes/watchlistRoutes.js
   - ./routes/fundRoutes.js
   - ./routes/searchRoutes.js
8. Add route mappings:
   - /api/watchlist -> watchlistRoutes
   - /api/funds -> fundRoutes
   - /api/search -> searchRoutes
9. Add a health check route:
   GET / should return JSON:
   {
     success: true,
     message: "Aureva Fund Insight Tracker API is running"
   }
10. Add a global 404 handler for unknown routes.
11. Add a global error handler that returns status 500 with a JSON error message.
12. Start the server on process.env.PORT or 5000.
13. Use clean CommonJS syntax with require/module.exports.
14. Keep the code beginner-friendly and readable.
*/

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const watchlistRoutes = require("./routes/watchlistRoutes");
const fundRoutes = require("./routes/fundRoutes");
const searchRoutes = require("./routes/searchRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
      
      if (!origin || origin.replace(/\/$/, "") === frontendUrl || origin === "http://localhost:5173") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Aureva Fund Insight Tracker API is running",
  });
});

app.use("/api/watchlist", watchlistRoutes);
app.use("/api/funds", fundRoutes);
app.use("/api/search", searchRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
