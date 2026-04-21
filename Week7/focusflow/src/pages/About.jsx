export default function About() {
  return (
    <section className="about-box">
      <span className="section-chip">About This Project</span>
      <h2>Concepts Implemented</h2>

      <div className="about-grid">
        <div className="about-card">
          <h3>React Hooks</h3>
          <p>Uses useState, useEffect, useMemo, and useContext across the application.</p>
        </div>

        <div className="about-card">
          <h3>Routing</h3>
          <p>Uses React Router to navigate between Home, Explore, Saved, and About pages.</p>
        </div>

        <div className="about-card">
          <h3>Global State</h3>
          <p>Uses Context API to manage saved items and share them across multiple pages.</p>
        </div>

        <div className="about-card">
          <h3>API Integration</h3>
          <p>Uses Axios to fetch real post data from the DummyJSON API.</p>
        </div>
      </div>
    </section>
  );
}