const TYPE_LABELS = {
  full:     { label: "Full Day",          cls: "tag-full" },
  evening:  { label: "Evening (4–6 PM)", cls: "tag-evening" },
  weekend:  { label: "Weekend",          cls: "tag-weekend" },
  observed: { label: "Observed (no JUS)", cls: "tag-weekend" },
};

export default function HolidayTable({ holidays, contractHours }) {
  return (
    <div className="card">
      <h2>Holiday Breakdown · {contractHours} h/week</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Holiday</th>
              <th>Date</th>
              <th>Day</th>
              <th>Type</th>
              <th>Your Day?</th>
              <th>Compensation</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((h) => {
              const excluded  = !h.included;
              const typeInfo  = TYPE_LABELS[h.type] || {};
              const tagCls    = excluded ? "tag tag-excluded" : `tag ${typeInfo.cls}`;
              const compCls   = h.compensation === 0 ? "td-comp zero" : "td-comp";
              const isWorking = h.compensation > 0 && h.included && h.on_working_day;
              const isBonus   = h.compensation > 0 && h.included && !h.on_working_day;

              return (
                <tr key={h.date} className={excluded ? "excluded" : ""}>
                  <td className="td-name">{h.name}</td>
                  <td>{formatDate(h.date)}</td>
                  <td>{h.day}</td>
                  <td>
                    <span className={tagCls}>
                      {excluded ? "Before start" : typeInfo.label}
                    </span>
                  </td>
                  <td>
                    {h.type === "weekend" || h.type === "observed" ? (
                      <span className="your-day-na">—</span>
                    ) : isWorking ? (
                      <span className="your-day-yes">✓ Working day</span>
                    ) : isBonus ? (
                      <span className="your-day-bonus">★ Bonus hours</span>
                    ) : (
                      <span className="your-day-na">—</span>
                    )}
                  </td>
                  <td className={compCls}>
                    {h.compensation > 0 ? `${h.compensation} hrs` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} style={{ paddingTop: 14, fontWeight: 700, fontSize: "0.82rem", color: "#666", textTransform: "uppercase" }}>
                Total JUS Compensation
              </td>
              <td style={{ paddingTop: 14, fontWeight: 800, color: "#0e6b6b", fontSize: "1rem" }}>
                {holidays.reduce((s, h) => s + h.compensation, 0).toFixed(1)} hrs
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-NL", { day: "numeric", month: "short", year: "numeric" });
}
