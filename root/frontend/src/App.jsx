import { useState } from "react";
import CalculatorForm from "./components/CalculatorForm";
import SummaryCard from "./components/SummaryCard";
import HolidayTable from "./components/HolidayTable";
import "./App.css";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleCalculate(formData) {
    setLoading(true);
    setError(null);
    try {
      const API = import.meta.env.VITE_API_URL || "https://juscalculator-production-bd59.up.railway.app";
      const res = await fetch(`${API}/api/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Backend error — please try again.");
      setResult(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-badge">CAO Apotheken 2024–2027</div>
        <h1>JUS Compensation Calculator</h1>
        <p>Calculate public holiday hours for pharmacy staff — Year 2026</p>
      </header>

      <main className="app-main">
        <CalculatorForm onCalculate={handleCalculate} loading={loading} />
        {error && <div className="error-banner">{error}</div>}
        {result && (
          <>
            <SummaryCard result={result} />
            <HolidayTable holidays={result.holidays} contractHours={result.contract_hours} />
          </>
        )}
      </main>

      <footer className="app-footer">
        Based on Pharmacy CLA 2024–2027 · Articles 16 &amp; 18 · WZOA/ASKA &amp; FNV/CNV
      </footer>
    </div>
  );
}
