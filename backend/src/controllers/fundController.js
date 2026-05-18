/*
Create controller for fetching mutual fund details from MFapi.in.

Function:
getFundDetails(req, res)

Requirements:
1. Import axios.
2. Read schemeCode from req.params.
3. Validate schemeCode is present and not empty.
4. Use process.env.MF_API_BASE_URL or fallback "https://api.mfapi.in".
5. Call external API:
   `${MF_API_BASE_URL}/mf/${schemeCode}`
6. The frontend must call this backend endpoint, not MFapi directly.
7. Add simple in-memory caching using Map:
   - cache key should be schemeCode
   - cache duration should be 1 hour
   - if cached data exists and is not expired, return cached response
8. If MFapi returns no data or invalid response, return 404.
9. On success, return:
   {
     success: true,
     source: "cache" or "mfapi",
     data: response.data
   }
10. Handle axios errors:
   - If external API returns 404, return 404
   - Otherwise return 500 with friendly error
11. Use async/await and try-catch.
12. Export getFundDetails using module.exports.
13. Use CommonJS syntax.
*/

const axios = require("axios");

const fundCache = new Map();
const CACHE_DURATION = 60 * 60 * 1000;

const getFundDetails = async (req, res) => {
  try {
    const { schemeCode } = req.params;

    if (!schemeCode || !schemeCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "schemeCode is required",
      });
    }

    const cleanSchemeCode = schemeCode.trim();
    const cachedFund = fundCache.get(cleanSchemeCode);

    if (cachedFund && Date.now() - cachedFund.timestamp < CACHE_DURATION) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: cachedFund.data,
      });
    }

    const baseUrl = process.env.MF_API_BASE_URL || "https://api.mfapi.in";
    const url = `${baseUrl}/mf/${cleanSchemeCode}`;

    const response = await axios.get(url);

    if (!response.data || !response.data.data) {
      return res.status(404).json({
        success: false,
        message: "No NAV data found for this scheme",
      });
    }

    fundCache.set(cleanSchemeCode, {
      data: response.data,
      timestamp: Date.now(),
    });

    return res.status(200).json({
      success: true,
      source: "mfapi",
      data: response.data,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Fund not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch fund details",
    });
  }
};

module.exports = {
  getFundDetails,
};
