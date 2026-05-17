# JUS Calculator

A full-stack web application that calculates **JUS (holiday compensation hours)** for pharmacy employees in the Netherlands, based on the *CAO Apotheken 2024–2027* collective labor agreement (articles 16 & 18).

---

## Overview

Dutch pharmacy staff are entitled to additional hours of compensation for working on or around public holidays. This tool automates that calculation: given a contract type and hours, it identifies all relevant Dutch public holidays for a year, classifies each holiday, and computes the total compensation owed.

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite, ESLint              |
| Backend  | Python, FastAPI, Uvicorn, Pydantic  |
| Deploy   | Railway (backend)                   |

---

## Features

- Fetches and classifies all Dutch public holidays for any given year
- Categorizes holidays as `full`, `evening`, `weekend`, or `observed`
- Computes compensation hours per holiday based on contract hours
- Displays a per-holiday breakdown table
- Shows a summary card with gross/net hours and totals
- Scales calculations to contract percentage (part-time support)
- References the 1878-hour CLA long-term annual baseline for 36-hour contracts

---

## Project Structure

```
root/
├── backend/
│   ├── main.py              # FastAPI app with calculation logic
│   ├── requirements.txt     # Python dependencies
│   ├── Procfile             # Railway process definition
│   ├── railway.json         # Railway deployment config
│   ├── runtime.txt          # Python runtime version
│   └── .python-version
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── CalculatorForm.jsx   # User inputs
│   │   │   ├── HolidayTable.jsx     # Per-holiday results
│   │   │   ├── SummaryCard.jsx      # Aggregated totals
│   │   │   └── Loader.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── start.ps1                # Local dev launcher (Windows)
```

---

## Getting Started

### Prerequisites

- Python 3.x
- Node.js + npm

### Quick Start (Windows)

```powershell
cd root
.\start.ps1
```

This script:
1. Installs Python dependencies (`pip install -r requirements.txt`)
2. Starts the FastAPI backend at `http://localhost:8000` in a new window
3. Starts the React frontend at `http://localhost:5173` in a new window

Then open **http://localhost:5173** in your browser.

### Manual Setup

**Backend:**
```bash
cd root/backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd root/frontend
npm install
npm run dev
```

---

## API Endpoints

### `GET /api/holidays/{year}`

Returns all Dutch public holidays for the given year with their type and date.

**Example:**
```
GET /api/holidays/2026
```

### `POST /api/calculate`

Calculates JUS compensation hours based on contract details.

**Request body:**
```json
{
  "year": 2026,
  "contract_hours": 36,
  "contract_percentage": 100
}
```

**Response includes:**
- Per-holiday compensation breakdown
- Total JUS hours (gross and net)
- Count of working-day vs. bonus holidays

---

## Holiday Classification

| Type       | Compensation                                  |
|------------|-----------------------------------------------|
| `full`     | `contract_hours ÷ 5`                          |
| `evening`  | `1.5 × (contract_hours ÷ 36)`                 |
| `weekend`  | 0 hours                                       |
| `observed` | 0 hours                                       |

---

## Deployment

The backend is configured for deployment on [Railway](https://railway.app) via `Procfile` and `railway.json`. The frontend can be built with:

```bash
cd root/frontend
npm run build
```

---

## Legal Basis

Calculations follow **CAO Apotheken 2024–2027**, articles 16 & 18, as agreed upon by the relevant Dutch pharmacy labor union organizations.

---

## License

No license specified. All rights reserved by the author.
