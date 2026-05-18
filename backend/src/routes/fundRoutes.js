/*
Create Express routes for mutual fund details.

Requirements:
1. Import express.
2. Create router.
3. Import getFundDetails from ../controllers/fundController.
4. Define route:
   - GET "/:schemeCode" -> getFundDetails
5. Export router using module.exports.
6. Use CommonJS syntax.
*/

const express = require("express");
const { getFundDetails } = require("../controllers/fundController");

const router = express.Router();

router.get("/:schemeCode", getFundDetails);

module.exports = router;
