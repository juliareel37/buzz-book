import Link from "next/link";
import type { CSSProperties } from "react";

export default function HomePage() {
  const bacValue = 0.06;
  const progress = 60;

  return (
    <section className="home-screen">
      <div className="home-copy">
        <h1>Track those drinks homie.</h1>
      </div>

      <section className="bac-section" aria-label="Current BAC">
        <p className="bac-label">Current BAC</p>
        <div
          className="bac-ring"
          style={
            {
              "--progress": `${progress}%`,
            } as CSSProperties
          }
        >
          <div className="bac-ring-inner">
            <span className="bac-value">{bacValue.toFixed(2)}%</span>
          </div>
        </div>
      </section>

      <section className="stats-grid" aria-label="Tonight summary">
        <article className="stat-card">
          <p className="stat-label">Drinks Tonight</p>
          <strong className="stat-value">4</strong>
        </article>

        <article className="stat-card">
          <p className="stat-label">Last Drink</p>
          <strong className="stat-value">9:40</strong>
        </article>
      </section>

      <Link href="/log" className="primary-action">
        <span className="primary-action-copy">
          <span className="primary-action-title">Add a drink</span>
        </span>
        <span className="primary-action-icon" aria-hidden="true">
          +
        </span>
      </Link>
    </section>
  );
}
