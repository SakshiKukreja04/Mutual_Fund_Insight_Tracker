import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getFundDetails } from "../services/api";
import NavChart from "../components/NavChart";
import "./FundDetail.css";

/*
Implement safe NAV data parsing and range filtering.

Requirements:
1. MFapi returns NAV data as array with:
   - date in dd-mm-yyyy format
   - nav as string
2. Create parseNavData function:
   - Validate input is an array
   - Split date by "-"
   - Convert dd-mm-yyyy to yyyy-mm-dd
   - Convert nav using parseFloat
   - Remove invalid dates and invalid NAV values
   - Sort data oldest to newest using timestamp
3. Create filterDataByRange function:
   - Support ranges: 1Y, 3Y, 5Y, All
   - Default selected range should be 5Y
   - For 1Y/3Y/5Y, calculate cutoff date from current date
   - Return only data greater than or equal to cutoff date
4. Use parsed and filtered data for Recharts line chart.
5. Handle no NAV data gracefully.
*/

const FundDetail = () => {
  const { schemeCode } = useParams();
  const [fundData, setFundData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("5Y");

  useEffect(() => {
    fetchFundDetails();
  }, [schemeCode]);

  const fetchFundDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getFundDetails(schemeCode);
      if (data.success) {
        setFundData(data.data);
      } else {
        setError("Failed to fetch fund details");
      }
    } catch (err) {
      setError("Error fetching fund details: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseNavData = (navData) => {
    // Validate input is an array
    if (!Array.isArray(navData)) return [];

    return navData
      .map((item) => {
        // Split dd-mm-yyyy format
        const [day, month, year] = item.date.split("-");
        
        // Convert to yyyy-mm-dd format and create Date object
        const parsedDate = new Date(`${year}-${month}-${day}`);
        const navValue = parseFloat(item.nav);

        return {
          date: `${year}-${month}-${day}`,
          nav: navValue,
          timestamp: parsedDate,
        };
      })
      // Remove invalid dates and invalid NAV values
      .filter((item) => !isNaN(item.timestamp.getTime()) && !isNaN(item.nav))
      // Sort oldest to newest
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const filterDataByRange = (data, range) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    if (range === "All") return data;

    const now = new Date();
    const yearsMap = {
      "1Y": 1,
      "3Y": 3,
      "5Y": 5,
    };

    const years = yearsMap[range];
    if (!years) return data;

    const cutoffDate = new Date(
      now.getFullYear() - years,
      now.getMonth(),
      now.getDate()
    );

    return data.filter((item) => item.timestamp >= cutoffDate);
  };

  if (loading) {
    return (
      <div className="fund-detail-page">
        <div className="loading-state">
          <p>Loading fund details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fund-detail-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!fundData) {
    return (
      <div className="fund-detail-page">
        <div className="error-message">No fund data available</div>
      </div>
    );
  }

  const navData = parseNavData(fundData.data);
  const filteredData = filterDataByRange(navData, timeRange);
  const latestNav = navData.length > 0 ? navData[navData.length - 1].nav : 0;

  return (
    <div className="fund-detail-page">
      <div className="fund-header">
        <div className="header-info">
          <h1>{fundData.meta?.schemeName}</h1>
          <p className="scheme-code">{schemeCode}</p>
          <div className="nav-info">
            <p className="latest-nav">
              Latest NAV: <span className="nav-value">₹{latestNav.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <div className="range-buttons">
          <button
            className={`range-btn ${timeRange === "1Y" ? "active" : ""}`}
            onClick={() => setTimeRange("1Y")}
          >
            1Y
          </button>
          <button
            className={`range-btn ${timeRange === "3Y" ? "active" : ""}`}
            onClick={() => setTimeRange("3Y")}
          >
            3Y
          </button>
          <button
            className={`range-btn ${timeRange === "5Y" ? "active" : ""}`}
            onClick={() => setTimeRange("5Y")}
          >
            5Y
          </button>
          <button
            className={`range-btn ${timeRange === "All" ? "active" : ""}`}
            onClick={() => setTimeRange("All")}
          >
            All
          </button>
        </div>

        {filteredData.length > 0 ? (
          <NavChart data={filteredData} />
        ) : (
          <div className="error-message">No NAV data available for this range</div>
        )}
      </div>

      <div className="stats-section">
        <h2>Fund Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Data Points</p>
            <p className="stat-value">{filteredData.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Latest NAV</p>
            <p className="stat-value">₹{latestNav.toFixed(2)}</p>
          </div>
          {filteredData.length > 1 && (
            <>
              <div className="stat-card">
                <p className="stat-label">Highest</p>
                <p className="stat-value">
                  ₹{Math.max(...filteredData.map((d) => d.nav)).toFixed(2)}
                </p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Lowest</p>
                <p className="stat-value">
                  ₹{Math.min(...filteredData.map((d) => d.nav)).toFixed(2)}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundDetail;
