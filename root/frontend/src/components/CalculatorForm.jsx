import { useState } from "react";

const DAYS = [
  { label: "Mon", value: 0 },
  { label: "Tue", value: 1 },
  { label: "Wed", value: 2 },
  { label: "Thu", value: 3 },
  { label: "Fri", value: 4 },
];

const CURRENT_YEAR = new Date().getFullYear();

export default function CalculatorForm({ onCalculate, loading }) {
  const [contractHours, setContractHours] = useState(36);
  const [year, setYear]                   = useState(2026);
  const [startDate, setStartDate]         = useState("");
  const [workingDays, setWorkingDays]     = useState([0, 1, 2, 3, 4]);

  function toggleDay(val) {
    setWorkingDays((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val].sort()
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (workingDays.length === 0) return;
    onCalculate({
      contract_hours: parseFloat(contractHours),
      year:           parseInt(year),
      start_date:     startDate || null,
      working_days:   workingDays,
    });
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Employee Details</h2>

      <div className="form-row">
        {/* Hours per week */}
        <div className="form-group">
          <label htmlFor="hours">Hours per Week</label>
          <div className="hours-input-wrap">
            <button
              type="button"
              className="hours-btn"
              onClick={() => setContractHours((h) => Math.max(1, parseFloat(h) - 0.5))}
            >−</button>
            <input
              id="hours"
              type="number"
              min="1"
              max="40"
              step="0.5"
              value={contractHours}
              onChange={(e) => setContractHours(e.target.value)}
              required
            />
            <button
              type="button"
              className="hours-btn"
              onClick={() => setContractHours((h) => Math.min(40, parseFloat(h) + 0.5))}
            >+</button>
          </div>
          <p className="form-note">{((contractHours / 36) * 100).toFixed(1)}% contract · {(contractHours / 5).toFixed(2)} hrs/day</p>
        </div>

        {/* Year */}
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            id="year"
            type="number"
            min="2024"
            max="2035"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          <p className="form-note">Holidays are calculated for this year</p>
        </div>

        {/* Start date */}
        <div className="form-group">
          <label htmlFor="start">Start Date <span className="optional">(optional)</span></label>
          <input
            id="start"
            type="date"
            min={`${year}-01-01`}
            max={`${year}-12-31`}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <p className="form-note">Leave blank to include all holidays</p>
        </div>
      </div>

      {/* Working days */}
      <div className="form-group" style={{ marginTop: 18 }}>
        <label>Working Days</label>
        <div className="day-toggles">
          {DAYS.map((d) => (
            <button
              key={d.value}
              type="button"
              className={`day-btn ${workingDays.includes(d.value) ? "active" : ""}`}
              onClick={() => toggleDay(d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className="form-note">
          {workingDays.length === 0
            ? "⚠️ Select at least one working day"
            : `${workingDays.length} day${workingDays.length > 1 ? "s" : ""} · ${contractHours} hrs spread over ${workingDays.length} day${workingDays.length > 1 ? "s" : ""} = ${(contractHours / workingDays.length).toFixed(2)} hrs/day worked`}
        </p>
      </div>

      <button
        className="btn-calculate"
        type="submit"
        disabled={loading || workingDays.length === 0}
      >
        {loading ? "Calculating…" : "Calculate JUS Compensation"}
      </button>
    </form>
  );
}
