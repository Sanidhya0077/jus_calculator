import { useState } from "react";

const PRESETS = [
  { label: "Full-time — 36 h/week (100%)", value: 36 },
  { label: "Part-time — 32 h/week (88.9%)", value: 32 },
  { label: "Part-time — 24 h/week (66.7%)", value: 24 },
  { label: "Custom", value: "custom" },
];

export default function CalculatorForm({ onCalculate, loading }) {
  const [preset, setPreset] = useState(36);
  const [customHours, setCustomHours] = useState("");
  const [startDate, setStartDate] = useState("2026-01-01");

  function getContractHours() {
    if (preset === "custom") return parseFloat(customHours) || 0;
    return preset;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const hours = getContractHours();
    if (hours <= 0 || hours > 40) return;
    onCalculate({ contract_hours: hours, start_date: startDate });
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Employee Details</h2>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="preset">Contract Size</label>
          <select
            id="preset"
            value={preset}
            onChange={(e) => setPreset(e.target.value === "custom" ? "custom" : Number(e.target.value))}
          >
            {PRESETS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {preset === "custom" && (
          <div className="form-group">
            <label htmlFor="custom">Hours per Week</label>
            <input
              id="custom"
              type="number"
              min="1"
              max="40"
              step="0.5"
              placeholder="e.g. 28"
              value={customHours}
              onChange={(e) => setCustomHours(e.target.value)}
              required
            />
            <p className="form-note">Between 1 and 40 hours</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="start">Employment Start Date</label>
          <input
            id="start"
            type="date"
            min="2026-01-01"
            max="2026-12-31"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <p className="form-note">Holidays before this date are excluded</p>
        </div>
      </div>

      <button className="btn-calculate" type="submit" disabled={loading}>
        {loading ? "Calculating…" : "Calculate JUS Compensation"}
      </button>
    </form>
  );
}
