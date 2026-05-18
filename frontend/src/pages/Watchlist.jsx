import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWatchlist, removeFromWatchlist } from "../services/api";
import "./Watchlist.css";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getWatchlist();
      if (data.success) {
        setWatchlist(data.data || []);
      } else {
        setError("Failed to fetch watchlist");
      }
    } catch (err) {
      setError("Error fetching watchlist: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (schemeCode) => {
    setRemovingId(schemeCode);
    try {
      const data = await removeFromWatchlist(schemeCode);
      if (data.success) {
        setWatchlist(watchlist.filter((f) => f.schemeCode !== schemeCode));
      } else {
        setError("Failed to remove fund");
      }
    } catch (err) {
      setError("Error removing fund: " + err.message);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="watchlist-page">
        <h1>My Watchlist</h1>
        <div className="loading-state">
          <p>Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-page">
      <h1>My Watchlist</h1>

      {error && <div className="error-message">{error}</div>}

      {watchlist.length === 0 ? (
        <div className="empty-state">
          <h2>Your watchlist is empty</h2>
          <p>Start by searching for mutual funds and adding them to your watchlist.</p>
          <button onClick={() => navigate("/")} className="primary-button">
            Search Funds
          </button>
        </div>
      ) : (
        <div className="watchlist-container">
          <p className="watchlist-count">Total funds: {watchlist.length}</p>
          <div className="watchlist-items">
            {watchlist.map((fund) => (
              <div key={fund.schemeCode} className="watchlist-item">
                <div className="item-info">
                  <h3>{fund.schemeName}</h3>
                  <p className="scheme-code">Code: {fund.schemeCode}</p>
                  <p className="added-date">
                    Added: {new Date(fund.addedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="item-actions">
                  <button
                    onClick={() => navigate(`/fund/${fund.schemeCode}`)}
                    className="view-button"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleRemove(fund.schemeCode)}
                    disabled={removingId === fund.schemeCode}
                    className="remove-button"
                  >
                    {removingId === fund.schemeCode ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
