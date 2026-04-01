import { metabolicEfficiencyValues, sexValues } from "@/db/schema";

type ProfileFormProps = {
  action: (formData: FormData) => void;
  submitLabel: string;
  defaults?: {
    sex: (typeof sexValues)[number];
    weightInPounds: number;
    metabolicEfficiency: (typeof metabolicEfficiencyValues)[number];
  };
};

const sexOptions: Record<(typeof sexValues)[number], string> = {
  female: "Female",
  male: "Male",
};

const metabolicOptions: Record<(typeof metabolicEfficiencyValues)[number], string> =
  {
    lightweight: "Lightweight",
    average: "Average",
    efficient: "Efficient",
  };

export function ProfileForm({
  action,
  submitLabel,
  defaults = {
    sex: "female",
    weightInPounds: 160,
    metabolicEfficiency: "average",
  },
}: ProfileFormProps) {
  return (
    <form action={action} className="onboarding-form">
      <section className="slider-card">
        <p className="slider-card-label">Sex</p>
        <div className="selection-grid sex-toggle-grid">
          {sexValues.map((value) => (
            <label key={value} className="selection-option">
              <input
                type="radio"
                name="sex"
                value={value}
                defaultChecked={value === defaults.sex}
              />
              <span className="selection-option-card">{sexOptions[value]}</span>
            </label>
          ))}
        </div>

        <label className="field profile-weight-field">
          <span className="field-label">Weight (lbs)</span>
          <input
            className="field-input"
            type="number"
            name="weightInPounds"
            min="70"
            max="600"
            step="1"
            defaultValue={defaults.weightInPounds}
            required
          />
        </label>
      </section>

      <section className="slider-card">
        <p className="slider-card-label">Metabolic Efficiency</p>
        <div className="metabolism-grid">
          {metabolicEfficiencyValues.map((value) => (
            <label key={value} className="metabolism-option">
              <input
                type="radio"
                name="metabolicEfficiency"
                value={value}
                defaultChecked={value === defaults.metabolicEfficiency}
              />
              <span>{metabolicOptions[value]}</span>
            </label>
          ))}
        </div>
      </section>

      <button type="submit" className="log-drink-button">
        {submitLabel}
      </button>
    </form>
  );
}
