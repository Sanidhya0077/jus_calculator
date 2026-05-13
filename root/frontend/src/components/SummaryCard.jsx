export default function SummaryCard({ result }) {
  const {
    gross_hours, holiday_hours, total_compensation, net_hours,
    contract_hours, contract_pct, year,
    working_day_holidays, bonus_holidays,
  } = result;

  return (
    <div className="card">
      <h2>{year} · {contract_hours} h/week ({contract_pct}%)</h2>

      <div className="summary-grid">
        <div className="summary-item">
          <span className="value">{gross_hours}</span>
          <span className="label">Gross Hours / Year</span>
        </div>
        <div className="summary-item">
          <span className="value">{holiday_hours}</span>
          <span className="label">Holiday Leave Hours</span>
        </div>
        <div className="summary-item">
          <span className="value">{total_compensation}</span>
          <span className="label">JUS Compensation</span>
        </div>
        <div className="summary-item highlight">
          <span className="value">{net_hours}</span>
          <span className="label">Net Hours to Work</span>
        </div>
      </div>

      <div className="formula-bar">
        <span className="formula-val">{gross_hours}</span>
        <span className="operator">−</span>
        <span>{holiday_hours} leave</span>
        <span className="operator">−</span>
        <span>{total_compensation} JUS</span>
        <span className="operator">=</span>
        <span className="formula-result">{net_hours} hrs net</span>
      </div>

      <div className="breakdown-row">
        <div className="breakdown-item working">
          <span className="bd-value">{working_day_holidays}</span>
          <span className="bd-label">On a working day</span>
          <span className="bd-sub">Employee gets the day off</span>
        </div>
        <div className="breakdown-divider">+</div>
        <div className="breakdown-item bonus">
          <span className="bd-value">{bonus_holidays}</span>
          <span className="bd-label">On a non-working day</span>
          <span className="bd-sub">Extra free hours (CLA bonus)</span>
        </div>
        <div className="breakdown-divider">=</div>
        <div className="breakdown-item total">
          <span className="bd-value">{working_day_holidays + bonus_holidays}</span>
          <span className="bd-label">Total compensated</span>
          <span className="bd-sub">{total_compensation} hrs off gross</span>
        </div>
      </div>
    </div>
  );
}
