# 🧭 Plan Trip — Frontend Itinerary Planner (MVP)
![Logo](/src/assets/branding/logo.png)

**Plan Trip** is a modern frontend web app that allows users to plan, calculate, and download custom trip itineraries with built-in budgeting tools.  
It helps users generate detailed itineraries, find suitable flights and accommodations (using simulated data for MVP), and export their plans in multiple formats (Excel, PDF, PowerPoint).

## Table of Contents
- [🚀 Overview](#-overview)
- [🧩 Tech Stack](#-tech-stack)
- [🧠 Key Features & Logic](#-key-features--logic)
- [🧱 Data Model (Frontend)](#-data-model-frontend)
- [🌍 Deployment](#-deployment)
- [🧑‍💻 Author](#%E2%80%8D-author)


---

## 🚀 Overview

Plan Trip is a **React (Vite)** + **Material UI** application designed for travelers who want to quickly plan, budget, and visualize their trips.  
Users can input trip details — such as origin, destination, travel dates, budgets, and daily activities — and receive detailed cost breakdowns and export options.


### 🎯 MVP Goals
- Input trip details: `From`, `To`, `Depart Date`, `Return Date`, budgets, and itinerary.
- Automatically calculate:
  - Total travel days and working days.
  - Check-in / check-out dates.
  - Min / max / average costs for flights and accommodations.
  - Per-day itinerary and transport costs (with manual activities entered).
  - Total estimated trip spending.
  - Monthly savings required before departure.
- Provide formatted exports:
  - **Version 1:** Excel / Google Sheets (`.xlsx` / `.csv`)
  - **Version 2:** PDF (printable itinerary)
  - **Version 3:** PowerPoint / Google Slides (`.pptx`)

---

## 🧩 Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend Framework | **React + Vite** |
| UI Library | **Material UI (MUI)** |
| State Management | **Zustand** (MVP) → **Redux Toolkit** (future, for real-time APIs) |
| Date Library | **dayjs** or **luxon** |
| File Exports | **SheetJS (xlsx)**, **jsPDF/pdfmake**, **PptxGenJS** |
| Deployment | **GitHub Pages (static)** |
| Version Control | Git / GitHub |

---

## 🧠 Key Features & Logic

- **Trip Builder Form:** Collect trip metadata and budget details.  
- **Itinerary Editor:** Add or remove daily activities with costs and transport segments.  
- **Flight & Accommodation Matching:** Simulated search using hardcoded data filtered by budget and date.  
- **Calculations:**
  - Total and working days.
  - Cost aggregation (min, max, avg).
  - Monthly savings goal until departure.
- **Exports:**
  - Download trip plan in Excel, PDF, or PowerPoint formats.
- **Analytics Summary:**
  - Total trip spend.
  - Accommodation averages (price, star rating).
  - Flight averages (price, duration, stops).

---

## 🧱 Data Model (Frontend)

```js
Trip {
  id,
  name,
  origin: { code, name },
  destination: { code, name },
  departDate,
  returnDate,
  currency: 'ZAR' | 'USD',
  flightBudget,
  accommodationBudget,
  itinerary: [ ItineraryItem ],
  createdAt
}

ItineraryItem {
  date,
  title,
  description,
  estimatedCost,
  transport: { mode, from, to, estCost }
}

FlightSample {
  id, airline, from, to, departISO, arriveISO, stops, durationMin, price, currency
}

HotelSample {
  id, name, location, checkInISO, checkOutISO, nightlyPrice, currency, starRating, googleRating, type: 'hotel'|'private'
}
```

## 🌍 Deployment
```bash
# Build for production
npm run build

# Deploy using gh-pages
npm run deploy
```

## 🧑‍💻 Author
Plan Trip — built and documented by [@TendaniN](https://github.com/TendaniN)
