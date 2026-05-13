from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import date
from typing import Optional

app = FastAPI(title="JUS Hours Calculator 2026")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

HOLIDAYS_2026 = [
    {"name": "New Year's Day",         "date": "2026-01-01", "day": "Thursday", "type": "full"},
    {"name": "Good Friday",            "date": "2026-04-03", "day": "Friday",   "type": "observed"},
    {"name": "Easter Sunday",          "date": "2026-04-05", "day": "Sunday",   "type": "weekend"},
    {"name": "Easter Monday",          "date": "2026-04-06", "day": "Monday",   "type": "full"},
    {"name": "King's Day",             "date": "2026-04-27", "day": "Monday",   "type": "full"},
    {"name": "Liberation Day",         "date": "2026-05-05", "day": "Tuesday",  "type": "full"},
    {"name": "Ascension Day",          "date": "2026-05-14", "day": "Thursday", "type": "full"},
    {"name": "Whit Sunday",            "date": "2026-05-24", "day": "Sunday",   "type": "weekend"},
    {"name": "Whit Monday",            "date": "2026-05-25", "day": "Monday",   "type": "full"},
    {"name": "Christmas Eve (4–6 PM)", "date": "2026-12-24", "day": "Thursday", "type": "evening"},
    {"name": "Christmas Day",          "date": "2026-12-25", "day": "Friday",   "type": "full"},
    {"name": "Boxing Day",             "date": "2026-12-26", "day": "Saturday", "type": "weekend"},
    {"name": "New Year's Eve (4–6 PM)","date": "2026-12-31", "day": "Thursday", "type": "evening"},
]


def calc_compensation(contract_hours: float, holiday_type: str) -> float:
    if holiday_type in ("weekend", "observed"):
        return 0.0
    elif holiday_type == "full":
        return round(contract_hours / 5, 2)
    elif holiday_type == "evening":
        # 1.5 hrs for full-time (36h), pro-rata for part-time
        return round(1.5 * (contract_hours / 36), 2)
    return 0.0


class CalculationRequest(BaseModel):
    contract_hours: float
    start_date: Optional[str] = "2026-01-01"


@app.get("/api/holidays")
def get_holidays():
    return HOLIDAYS_2026


@app.post("/api/calculate")
def calculate(req: CalculationRequest):
    start = date.fromisoformat(req.start_date)

    results = []
    total_compensation = 0.0

    for h in HOLIDAYS_2026:
        hdate = date.fromisoformat(h["date"])
        included = hdate >= start
        comp = calc_compensation(req.contract_hours, h["type"]) if included else 0.0
        total_compensation += comp
        results.append({**h, "included": included, "compensation": comp})

    contract_pct = req.contract_hours / 36
    gross_hours = round(1878 * contract_pct)
    holiday_hours = round(180 * contract_pct)
    net_hours = round(gross_hours - round(total_compensation, 2) - holiday_hours, 1)

    return {
        "holidays": results,
        "total_compensation": round(total_compensation, 2),
        "gross_hours": gross_hours,
        "holiday_hours": holiday_hours,
        "net_hours": net_hours,
        "contract_hours": req.contract_hours,
        "contract_pct": round(contract_pct * 100, 1),
    }
