import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchFunds, addToWatchlist } from "../services/api";
import "./Home.css";

const Home = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addingToWatchlist, setAddingToWatchlist] = useState({});
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setHasSearched(true);

    try {
      const data = await searchFunds(query);
      if (data.success) {
        setResults(data.data || []);
        if (!data.data || data.data.length === 0) {
          setError("No funds found. Try a different search.");
        }
      } else {
        setError("Search failed. Please try again.");
      }
    } catch (err) {
      setError("Error searching funds: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async (fund) => {
    setAddingToWatchlist({ ...addingToWatchlist, [fund.schemeCode]: true });

    try {
      const data = await addToWatchlist({
        schemeCode: fund.schemeCode,
        schemeName: fund.schemeName,
      });

      if (data.success) {
        alert("Fund added to watchlist!");
      } else if (data.message && data.message.includes("already")) {
        setError(data.message);
      } else {
        setError("Failed to add fund to watchlist");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("This fund is already in your watchlist");
      } else {
        setError("Error: " + err.message);
      }
    } finally {
      setAddingToWatchlist({ ...addingToWatchlist, [fund.schemeCode]: false });
    }
  };

  return (
    <div className="home-page">
      <h1>Search Mutual Funds</h1>
      <p className="subtitle">Find and track your favorite mutual funds</p>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search by fund name or code (e.g., HDFC, Axis)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading && (
        <div className="loading-state">
          <p>Searching for funds...</p>
        </div>
      )}

      {!loading && results.length === 0 && hasSearched && query && !error && (
        <div className="empty-state">
          <p>No results found for "{query}"</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="results-container">
          <h2>Search Results ({results.length})</h2>
          <div className="fund-list">
            {results.map((fund) => (
              <div key={fund.schemeCode} className="fund-card">
                <div className="fund-info">
                  <h3>{fund.schemeName}</h3>
                  <p className="scheme-code">Code: {fund.schemeCode}</p>
                </div>
                <div className="fund-actions">
                  <button
                    onClick={() => navigate(`/fund/${fund.schemeCode}`)}
                    className="view-button"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleAddToWatchlist(fund)}
                    disabled={addingToWatchlist[fund.schemeCode]}
                    className="add-button"
                  >
                    {addingToWatchlist[fund.schemeCode]
                      ? "Adding..."
                      : "Add to Watchlist"}
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

export default Home;
