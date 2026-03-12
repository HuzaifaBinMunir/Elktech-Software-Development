import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-text">
        <span className="hero-badge">Explore • Save • Organize</span>
        <h2>Organize ideas, explore content, and save what matters.</h2>
        <p>
          FocusFlow is a clean React application built for general use with routing, hooks, context API,
          and real API data with a polished frontend.
        </p>
        <div className="hero-actions">
          <Link to="/explore" className="primary-btn">
            Start Exploring
          </Link>
          <Link to="/about" className="secondary-btn">
            Learn More
          </Link>
        </div>
      </div>

      <div className="hero-card">
        <h3>What this project demonstrates</h3>
        <ul>
          <li>React Router for multi-page navigation</li>
          <li>Context API for shared saved posts</li>
          <li>Axios for API integration</li>
          <li>Loading, error, filtering, and reusable UI</li>
        </ul>
      </div>
    </section>
  );
}