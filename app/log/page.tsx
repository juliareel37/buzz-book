"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

const drinkTypes = [
  { id: "beer", label: "Beer", icon: "/icons/beer.svg" },
  { id: "wine", label: "Wine", icon: "/icons/wine.svg" },
  { id: "liquor", label: "Liquor", icon: "/icons/liquor.svg" },
  { id: "cocktail", label: "Cocktail", icon: "/icons/cocktail.svg" },
] as const;

export default function LogPage() {
  const [selectedType, setSelectedType] =
    useState<(typeof drinkTypes)[number]["id"]>("beer");
  const [servingSize, setServingSize] = useState(12);
  const [abv, setAbv] = useState(5);

  return (
    <section className="log-screen">
      <div className="log-header">
        <h1>What&apos;s in the glass?</h1>
      </div>

      <section className="drink-type-section" aria-label="Drink type">
        <div className="drink-type-grid">
          {drinkTypes.map((drinkType) => {
            const isActive = selectedType === drinkType.id;

            return (
              <button
                key={drinkType.id}
                type="button"
                className={`drink-type-card${isActive ? " active" : ""}`}
                onClick={() => setSelectedType(drinkType.id)}
              >
                <span className="drink-type-card-inner">
                  <span className="drink-type-icon" aria-hidden="true">
                    <span
                      className="drink-type-icon-image"
                      style={
                        {
                          "--icon-url": `url(${drinkType.icon})`,
                        } as CSSProperties
                      }
                    />
                  </span>
                  <span className="drink-type-label">{drinkType.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <button type="button" className="custom-mix-button">
          Custom Mix
        </button>
      </section>

      <section className="slider-card" aria-label="Serving size">
        <div className="slider-card-header">
          <p className="slider-card-label">Serving Size</p>
          <div className="slider-card-controls">
            <span className="slider-value">{servingSize.toFixed(1)} oz</span>
            <div className="stepper-group" aria-label="Serving size controls">
              <button
                type="button"
                className="stepper-button"
                onClick={() => setServingSize((current) => Math.max(1, current - 0.5))}
              >
                -
              </button>
              <button
                type="button"
                className="stepper-button"
                onClick={() => setServingSize((current) => Math.min(32, current + 0.5))}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <input
          className="slider-input"
          type="range"
          min="1"
          max="32"
          step="0.5"
          value={servingSize}
          onChange={(event) => setServingSize(Number(event.target.value))}
        />
      </section>

      <section className="slider-card" aria-label="Alcohol by volume">
        <div className="slider-card-header">
          <p className="slider-card-label">Alcohol by Volume</p>
          <div className="slider-card-controls">
            <span className="slider-value">{abv.toFixed(1)}%</span>
          </div>
        </div>

        <input
          className="slider-input"
          type="range"
          min="0"
          max="60"
          step="0.5"
          value={abv}
          onChange={(event) => setAbv(Number(event.target.value))}
        />
      </section>

      <button type="button" className="log-drink-button">
        Log Drink
      </button>
    </section>
  );
}
