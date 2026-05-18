/*
Create Express router for mutual fund search.

Requirements:
1. Import express.
2. Create router using express.Router().
3. Import searchFunds from ../controllers/searchController.
4. Add route:
   - GET "/" should call searchFunds
5. Export router using module.exports.
6. Use CommonJS syntax.
*/

const express = require("express");
const { searchFunds } = require("../controllers/searchController");

const router = express.Router();

router.get("/", searchFunds);

module.exports = router;
