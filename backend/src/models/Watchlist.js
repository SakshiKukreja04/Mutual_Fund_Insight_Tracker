/*
Create a Mongoose model for a mutual fund watchlist item.

Requirements:
1. Import mongoose.
2. Create a schema with these fields:
   - schemeCode: String, required, unique, trim
   - schemeName: String, required, trim
   - addedAt: Date, default Date.now
3. Add timestamps false because addedAt is enough.
4. Add an index on schemeCode for uniqueness.
5. Export the model named "Watchlist".
6. Use CommonJS syntax.
*/

const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    schemeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    schemeName: {
      type: String,
      required: true,
      trim: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

watchlistSchema.index({ schemeCode: 1 }, { unique: true });

module.exports = mongoose.model("Watchlist", watchlistSchema);
