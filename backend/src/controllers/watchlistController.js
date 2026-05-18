/*
Create controller functions for the watchlist API.

Model:
- Import Watchlist from ../models/Watchlist

Functions needed:

1. getWatchlist(req, res)
   - Fetch all watchlist items from MongoDB.
   - Sort by addedAt descending.
   - Return status 200 with:
     {
       success: true,
       count: items.length,
       data: items
     }

2. addToWatchlist(req, res)
   - Read schemeCode and schemeName from req.body.
   - Validate both fields are present.
   - Convert schemeCode to string and trim both fields.
   - If missing, return status 400.
   - Check if schemeCode already exists.
   - If exists, return status 409 with duplicate message.
   - Create new watchlist item.
   - Return status 201 with:
     {
       success: true,
       message: "Fund added to watchlist",
       data: item
     }
   - Also handle MongoDB duplicate key error code 11000 with status 409.

3. removeFromWatchlist(req, res)
   - Read schemeCode from req.params.
   - Validate schemeCode.
   - Find item by schemeCode and delete it.
   - If not found, return status 404.
   - If deleted, return status 200 with success message.

General:
- Use async/await.
- Use try-catch in every function.
- Return JSON responses.
- Export all functions using module.exports.
- Use CommonJS syntax.
*/

const Watchlist = require("../models/Watchlist");

const getWatchlist = async (req, res) => {
  try {
    const items = await Watchlist.find().sort({ addedAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch watchlist",
    });
  }
};

const addToWatchlist = async (req, res) => {
  try {
    let { schemeCode, schemeName } = req.body;

    if (!schemeCode || !schemeName) {
      return res.status(400).json({
        success: false,
        message: "schemeCode and schemeName are required",
      });
    }

    schemeCode = String(schemeCode).trim();
    schemeName = String(schemeName).trim();

    if (!schemeCode || !schemeName) {
      return res.status(400).json({
        success: false,
        message: "schemeCode and schemeName cannot be empty",
      });
    }

    const existingFund = await Watchlist.findOne({ schemeCode });

    if (existingFund) {
      return res.status(409).json({
        success: false,
        message: "This fund is already in your watchlist",
      });
    }

    const item = await Watchlist.create({
      schemeCode,
      schemeName,
    });

    return res.status(201).json({
      success: true,
      message: "Fund added to watchlist",
      data: item,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This fund is already in your watchlist",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add fund to watchlist",
    });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { schemeCode } = req.params;

    if (!schemeCode || !schemeCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "schemeCode is required",
      });
    }

    const deletedItem = await Watchlist.findOneAndDelete({
      schemeCode: schemeCode.trim(),
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Fund not found in watchlist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fund removed from watchlist",
      data: deletedItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove fund from watchlist",
    });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};
