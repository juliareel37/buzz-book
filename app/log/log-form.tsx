"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

const drinkTypes = [
  { id: "beer", label: "Beer", icon: "/icons/beer.svg" },
  { id: "wine", label: "Wine", icon: "/icons/wine.svg" },
  { id: "liquor", label: "Liquor", icon: "/icons/liquor.svg" },
  { id: "cocktail", label: "Cocktail", icon: "/icons/cocktail.svg" },
] as const;

const defaultDrinkValues = {
  beer: { servingSize: 12, abv: 5 },
  wine: { servingSize: 5, abv: 12 },
  liquor: { servingSize: 1.5, abv: 40 },
  cocktail: { servingSize: 5, abv: 12 },
  custom_mix: { servingSize: 12, abv: 10 },
} as const;

type LogFormProps = {
  action: (formData: FormData) => void;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`log-drink-button${pending ? " is-pending" : ""}`}
      disabled={pending}
    >
      {pending ? "Logging..." : "Log Drink"}
    </button>
  );
}

export function LogForm({ action }: LogFormProps) {
  const [selectedType, setSelectedType] =
    useState<(typeof drinkTypes)[number]["id"] | "custom_mix">("beer");
  const [servingSize, setServingSize] = useState<number>(defaultDrinkValues.beer.servingSize);
  const [abv, setAbv] = useState<number>(defaultDrinkValues.beer.abv);
  const [customDrinkName, setCustomDrinkName] = useState("");
  const [consumptionTimeMode, setConsumptionTimeMode] = useState<"now" | "manual">("now");
  const [manualConsumptionTime, setManualConsumptionTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });
  const [isEntering, setIsEntering] = useState(false);

  function selectDrinkType(type: (typeof drinkTypes)[number]["id"] | "custom_mix") {
    setSelectedType(type);
    setServingSize(defaultDrinkValues[type].servingSize);
    setAbv(defaultDrinkValues[type].abv);
  }

  useEffect(() => {
    const transition = sessionStorage.getItem("buzz-book-transition");

    if (transition !== "log-enter") {
      return;
    }

    sessionStorage.removeItem("buzz-book-transition");
    setIsEntering(true);

    const timeout = window.setTimeout(() => {
      setIsEntering(false);
    }, 220);

    return () => window.clearTimeout(timeout);
  }, []);

  function getManualConsumedAtIso() {
    const [hours, minutes] = manualConsumptionTime.split(":").map(Number);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return "";
    }

    const now = new Date();
    const consumedAt = new Date(now);
    consumedAt.setHours(hours, minutes, 0, 0);

    if (consumedAt.getTime() > now.getTime() + 60_000) {
      consumedAt.setDate(consumedAt.getDate() - 1);
    }

    return consumedAt.toISOString();
  }

  return (
    <form
      action={async (formData) => {
        sessionStorage.setItem("buzz-book-transition", "home-enter");
        await action(formData);
      }}
      className={`log-screen${isEntering ? " is-entering" : ""}`}
    >
      <input type="hidden" name="drinkType" value={selectedType} />
      <input type="hidden" name="servingSizeOz" value={servingSize} />
      <input type="hidden" name="abvPercent" value={abv} />
      <input type="hidden" name="consumptionTimeMode" value={consumptionTimeMode} />
      <input
        type="hidden"
        name="consumedAtIso"
        value={consumptionTimeMode === "manual" ? getManualConsumedAtIso() : ""}
      />

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
                onClick={() => selectDrinkType(drinkType.id)}
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

        <button
          type="button"
          className={`custom-mix-button${selectedType === "custom_mix" ? " active" : ""}`}
          onClick={() => selectDrinkType("custom_mix")}
        >
          <span className="custom-mix-button-inner">
            <span className="custom-mix-button-plus" aria-hidden="true">
              <span className="custom-mix-button-plus-icon" />
            </span>
            <span className="custom-mix-button-copy">Custom</span>
          </span>
        </button>

        {selectedType === "custom_mix" ? (
          <label className="field custom-drink-field">
            <span className="field-label">
              Custom Drink Name <span className="field-label-optional">(Optional)</span>
            </span>
            <input
              className="field-input"
              type="text"
              name="customDrinkName"
              placeholder="Spicy marg, ranch water, etc."
              value={customDrinkName}
              onChange={(event) => setCustomDrinkName(event.target.value)}
            />
          </label>
        ) : (
          <input type="hidden" name="customDrinkName" value="" />
        )}
      </section>

      <section className="slider-card" aria-label="Serving size">
        <div className="slider-card-header">
          <p className="slider-card-label">Serving Size</p>
          <div className="slider-card-controls">
            <span className="slider-value">{servingSize.toFixed(1)} oz</span>
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
          min="0.5"
          max="60"
          step="0.5"
          value={abv}
          onChange={(event) => setAbv(Number(event.target.value))}
        />
      </section>

      <section className="slider-card" aria-label="Time of consumption">
        <div className="slider-card-header">
          <p className="slider-card-label">Time of Consumption</p>
        </div>

        <div className="selection-grid time-mode-grid">
          <label className="selection-option">
            <input
              type="radio"
              name="consumption-time-mode-ui"
              checked={consumptionTimeMode === "now"}
              onChange={() => setConsumptionTimeMode("now")}
            />
            <span className="selection-option-card">Just Now</span>
          </label>

          <label className="selection-option">
            <input
              type="radio"
              name="consumption-time-mode-ui"
              checked={consumptionTimeMode === "manual"}
              onChange={() => setConsumptionTimeMode("manual")}
            />
            <span className="selection-option-card">Enter Time</span>
          </label>
        </div>

        {consumptionTimeMode === "manual" ? (
          <label className="field time-consumed-field">
            <span className="field-label">Time</span>
            <input
              className="field-input"
              type="time"
              value={manualConsumptionTime}
              onChange={(event) => setManualConsumptionTime(event.target.value)}
            />
          </label>
        ) : null}
      </section>

      <SubmitButton />
    </form>
  );
}
