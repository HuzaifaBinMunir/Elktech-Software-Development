import { NavLink, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function Navbar() {
  const { savedItems } = useAppContext();

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-badge">F</span>
        <div>
          <h1>FocusFlow</h1>
        </div>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Home
        </NavLink>
        <NavLink
          to="/explore"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Explore
        </NavLink>
        <NavLink
          to="/saved"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          Saved ({savedItems.length})
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}