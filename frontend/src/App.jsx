/*
Set up routing for Aureva Fund Insight Tracker React app.

Requirements:
1. Use react-router-dom.
2. Import BrowserRouter, Routes, Route, Link.
3. Import pages:
   - Home from ./pages/Home
   - Watchlist from ./pages/Watchlist
   - FundDetail from ./pages/FundDetail
4. Create a simple navbar at the top.
5. Navbar should show:
   - App name: "Aureva Fund Insight Tracker"
   - Link to "/" with text "Search"
   - Link to "/watchlist" with text "Watchlist"
6. Define routes:
   - "/" renders Home
   - "/watchlist" renders Watchlist
   - "/fund/:schemeCode" renders FundDetail
7. Add a main container around pages.
8. Use simple className values for styling later.
9. Export App as default.
*/

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import FundDetail from "./pages/FundDetail";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <Link to="/" className="logo">
            Aureva Fund Insight Tracker
          </Link>

          <div className="nav-links">
            <Link to="/">Search</Link>
            <Link to="/watchlist">Watchlist</Link>
          </div>
        </nav>

        <main className="main-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/fund/:schemeCode" element={<FundDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
