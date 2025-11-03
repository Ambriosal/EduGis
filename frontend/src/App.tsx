import React from 'react';
import './index.css';

export default function App() {
  return (
    <main className="splash">
      <div className="card">
        <h1>EduGIS</h1>
        <p className="tagline">
          A simple GIS-style dashboard for education data: explore regions, filter schools, and visualize metrics
          without drowning in spreadsheets.
        </p>

        <div className="actions">
          <a
            className="btn primary"
            href="https://gitlab.socs.uoguelph.ca/groups/cis3760f25/sapphire/-/wikis/Product-Information"
            target="_blank"
            rel="noreferrer"
          >
            Product Pitch
          </a>
          <a className="btn" href="http://localhost:8080" target="_blank" rel="noreferrer">
            Backend (8080)
          </a>
        </div>

        <p className="small">
          Sprint 4 Placeholder · Deployed with Docker Compose (frontend:3000, backend:8080, DB:3306)
        </p>
      </div>
    </main>
  );
}
