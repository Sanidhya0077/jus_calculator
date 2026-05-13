import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import date, timedelta
from typing import Optional, List

app = FastAPI(title="JUS Hours Calculator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Easter algorithm (Anonymous Gregorian) ───────────────────────────────────
def get_easter(year: int) -> date:
    a = year % 19
    b = year // 100
    c = year % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month = (h + l - 7 * m + 114) // 31
    day = ((h + l - 7 * m + 114) % 31) + 1
    return date(year, month, day)


# ── Build holiday list for any year ─────────────────────────────────────────
def get_holidays_for_year(year: int) -> list:
    easter = get_easter(year)

    # King's Day: Apr 27, moved to Apr 26 if it falls on Sunday
    kings_day = date(year, 4, 27)
    if kings_day.weekday() == 6:
        kings_day = date(year, 4, 26)

    raw = [
        {"name": "New Year's Day",          "date": date(year, 1, 1),                    "base_type": "full"},
        {"name": "Good Friday",             "date": easter - timedelta(days=2),          "base_type": "observed"},
        {"name": "Easter Sunday",           "date": easter,                              "base_type": "full"},
        {"name": "Easter Monday",           "date": easter + timedelta(days=1),          "base_type": "full"},
        {"name": "King's Day",              "date": kings_day,                           "base_type": "full"},
        {"name": "Liberation Day",          "date": date(year, 5, 5),                    "base_type": "full"},
        {"name": "Ascension Day",           "date": easter + timedelta(days=39),         "base_type": "full"},
        {"name": "Whit Sunday",             "date": easter + timedelta(days=49),         "base_type": "full"},
        {"name": "Whit Monday",             "date": easter + timedelta(days=50),         "base_type": "full"},
        {"name": "Christmas Eve (4–6 PM)",  "date": date(year, 12, 24),                  "base_type": "evening"},
        {"name": "Christmas Day",           "date": date(year, 12, 25),                  "base_type": "full"},
        {"name": "Boxing Day",              "date": date(year, 12, 26),                  "base_type": "full"},
        {"name": "New Year's Eve (4–6 PM)", "date": date(year, 12, 31),                  "base_type": "evening"},
    ]

    result = []
    for h in raw:
        d = h["date"]
        wd = d.weekday()  # 0 = Monday … 6 = Sunday

        if h["base_type"] == "observed":
            actual_type = "observed"                          # Good Friday — no JUS
        elif h["base_type"] == "evening":
            actual_type = "evening" if wd < 5 else "weekend" # only counts on weekdays
        elif wd >= 5:
            actual_type = "weekend"                           # Sat / Sun
        else:
            actual_type = "full"

        result.append({
            "name":        h["name"],
            "date":        d.isoformat(),
            "day":         d.strftime("%A"),
            "type":        actual_type,
            "weekday_num": wd,
        })

    return result


# ── Compensation per holiday ─────────────────────────────────────────────────
def calc_compensation(contract_hours: float, holiday_type: str) -> float:
    if holiday_type in ("weekend", "observed"):
        return 0.0
    elif holiday_type == "full":
        return round(contract_hours / 5, 2)
    elif holiday_type == "evening":
        return round(1.5 * (contract_hours / 36), 2)
    return 0.0


# ── Request model ────────────────────────────────────────────────────────────
class CalculationRequest(BaseModel):
    contract_hours: float
    year: int = 2026
    start_date: Optional[str] = None
    working_days: List[int] = [0, 1, 2, 3, 4]  # 0 = Mon … 4 = Fri


# ── Endpoints ────────────────────────────────────────────────────────────────
@app.get("/api/holidays/{year}")
def get_holidays(year: int):
    return get_holidays_for_year(year)


@app.post("/api/calculate")
def calculate(req: CalculationRequest):
    start_str = req.start_date or f"{req.year}-01-01"
    start = date.fromisoformat(start_str)

    holidays = get_holidays_for_year(req.year)

    results = []
    total_compensation = 0.0
    working_day_holidays = 0   # holidays that replace a working day
    bonus_holidays = 0         # holidays on non-working days (extra free hours)

    for h in holidays:
        hdate = date.fromisoformat(h["date"])
        included = hdate >= start
        comp = calc_compensation(req.contract_hours, h["type"]) if included else 0.0
        total_compensation += comp

        on_working_day = h["weekday_num"] in req.working_days

        if included and comp > 0:
            if on_working_day:
                working_day_holidays += 1
            else:
                bonus_holidays += 1

        results.append({
            **h,
            "included":       included,
            "compensation":   comp,
            "on_working_day": on_working_day,
        })

    # CLA long-term average: 1878 hrs/yr for 36 h/week
    contract_pct = req.contract_hours / 36
    gross_hours   = round(1878 * contract_pct)
    holiday_hours = round(180  * contract_pct)
    net_hours     = round(gross_hours - round(total_compensation, 2) - holiday_hours, 1)

    return {
        "holidays":             results,
        "total_compensation":   round(total_compensation, 2),
        "gross_hours":          gross_hours,
        "holiday_hours":        holiday_hours,
        "net_hours":            net_hours,
        "contract_hours":       req.contract_hours,
        "contract_pct":         round(contract_pct * 100, 1),
        "year":                 req.year,
        "working_day_holidays": working_day_holidays,
        "bonus_holidays":       bonus_holidays,
    }
