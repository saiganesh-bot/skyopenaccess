import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";

export const PublicHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    const nextParams = query ? { q: query } : {};

    if (location.pathname === "/journals") {
      setSearchParams(nextParams);
      return;
    }

    navigate({ pathname: "/", search: query ? `?q=${encodeURIComponent(query)}` : "" });
  };

  return (
    <div className="header-wrapper">
      <div className="top-bar">
        <div className="top-bar-content">
          <div className="contact">
            <span>
              <i className="fa-solid fa-phone" />
              +91 9390535904
            </span>
            <span>
              <i className="fa-solid fa-envelope" />
              skyopenaccess@gmail.com
            </span>
          </div>

          <form className="search-box" onSubmit={submitSearch}>
            <i className="fa-solid fa-magnifying-glass" />
            <input
              type="text"
              placeholder="Search for Journals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-submit" type="submit" aria-label="Search">
              <i className="fa-solid fa-arrow-right" />
            </button>
          </form>

          <div className="right-section">
            <NavLink to="/submit" className="btn-primary">
              <i className="fa-solid fa-upload" />
              Online Submission
            </NavLink>
          </div>
        </div>
      </div>

      <nav className="navbar">
        <div className="container nav-content">
          <NavLink to="/" className="logo-link">
            <img src="/images/sky-logo-final.png" className="logo" alt="Logo" />
          </NavLink>

          <button
            className="nav-toggle"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <ul className={`nav-links${menuOpen ? " is-open" : ""}`}>
            <li>
              <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/open-access"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Open Access
              </NavLink>
            </li>
            <li>
              <NavLink to="/journals" className={({ isActive }) => (isActive ? "active" : "")}>
                Journals
              </NavLink>
            </li>
            <li>
              <NavLink to="/peer-review" className={({ isActive }) => (isActive ? "active" : "")}>
                Peer Review
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/author-guidelines"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Author Guidelines
              </NavLink>
            </li>
            <li>
              <NavLink to="/videos" className={({ isActive }) => (isActive ? "active" : "")}>
                Videos
              </NavLink>
            </li>
            <li>
              <NavLink to="/ppts" className={({ isActive }) => (isActive ? "active" : "")}>
                PPT
              </NavLink>
            </li>
            <li>
              <NavLink to="/membership" className={({ isActive }) => (isActive ? "active" : "")}>
                Membership
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};
