/*
Create Express routes for watchlist.

Requirements:
1. Import express.
2. Create router using express.Router().
3. Import these controller functions from ../controllers/watchlistController:
   - getWatchlist
   - addToWatchlist
   - removeFromWatchlist
4. Define routes:
   - GET "/" -> getWatchlist
   - POST "/" -> addToWatchlist
   - DELETE "/:schemeCode" -> removeFromWatchlist
5. Export router using module.exports.
6. Use CommonJS syntax.
*/

const express = require("express");
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} = require("../controllers/watchlistController");

const router = express.Router();

router.get("/", getWatchlist);
router.post("/", addToWatchlist);
router.delete("/:schemeCode", removeFromWatchlist);

module.exports = router;
