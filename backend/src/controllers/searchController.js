/*
Create controller for searching Indian mutual funds using MFapi.in.

Function:
searchFunds(req, res)

Requirements:
1. Import axios.
2. Read search query from req.query.q.
3. Validate q:
   - If q is missing or empty, return status 400.
   - Message: "Search query is required"
4. Use process.env.MF_API_BASE_URL or fallback "https://api.mfapi.in".
5. Call external API:
   `${baseUrl}/mf/search?q=${encodeURIComponent(q)}`
6. Return status 200 with:
   {
     success: true,
     count: results.length,
     data: results
   }
7. Each result from MFapi contains schemeCode and schemeName.
8. Handle errors using try-catch.
9. If MFapi fails, return status 500 with message:
   "Failed to search mutual funds"
10. Use CommonJS syntax.
11. Export searchFunds using module.exports.
*/

const axios = require("axios");

const searchFunds = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const baseUrl = process.env.MF_API_BASE_URL || "https://api.mfapi.in";
    const url = `${baseUrl}/mf/search?q=${encodeURIComponent(q.trim())}`;

    const response = await axios.get(url);
    const results = response.data || [];

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to search mutual funds",
    });
  }
};

module.exports = {
  searchFunds,
};
