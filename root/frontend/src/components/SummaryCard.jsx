export default function SummaryCard({ result }) {
  const { gross_hours, holiday_hours, total_compensation, net_hours, contract_hours, contract_pct } = result;

  return (
    <div className="card">
      <h2>Annual Hours Summary — {contract_hours} h/week ({contract_pct}%)</h2>

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
          <span className="label">JUS Compensation Hours</span>
        </div>
        <div className="summary-item highlight">
          <span className="value">{net_hours}</span>
          <span className="label">Net Hours to Work</span>
        </div>
      </div>

      <div className="formula-bar">
        <span className="formula-val">{gross_hours}</span>
        <span className="operator">−</span>
        <span>{holiday_hours} (leave)</span>
        <span className="operator">−</span>
        <span>{total_compensation} (public holidays)</span>
        <span className="operator">=</span>
        <span className="formula-result">{net_hours} hrs net</span>
      </div>
    </div>
  );
}
