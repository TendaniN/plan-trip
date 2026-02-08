# ✈️ Plan-Trip

<p align="center">
  <img src="src/assets/branding/plan-trip-high-resolution-logo-transparent.svg" alt="Plan-Trip Logo" width="180" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-blue.svg" alt="Version" />
  <img src="https://img.shields.io/badge/status-active%20development-yellow.svg" alt="Status" />
  <img src="https://img.shields.io/badge/react-19.x-61dafb.svg" alt="React" />
  <img src="https://img.shields.io/badge/typescript-strict-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/license-TBD-lightgrey.svg" alt="License" />
</p>

**Plan-Trip** is a trip-planning web application designed to make organising complex trips easier and more structured.  
It allows users to plan trips with multiple locations, manage itineraries, and keep track of budgets — all in one place.

> **Current version:** `0.1.0`  
> 🚧 This project is under active development.

---

## 🌍 Project Goal

Planning a trip often involves juggling dates, locations, activities, and budgets across multiple tools.  
**Plan-Trip** aims to simplify this by providing:

- A single source of truth for trip planning
- Clear visibility of schedules and costs
- Easy export of plans (PDF & PowerPoint)

---

## ✨ Features

### 🧳 Trips

- Create trips with a start and end date
- Each trip can contain:
  - Multiple locations
  - Travel entries (flights, trains, buses, cars)
  - One or more budgets

### 📍 Locations

- Each trip can have **multiple locations**
- A location includes:
  - Country & city
  - Arrival and departure dates
  - Number of nights
  - Optional accommodation
  - Linked itinerary items

### 🗓️ Itinerary

- Each location can have a detailed itinerary
- Itinerary items support:
  - Activity name & description
  - Date & time
  - Duration
  - Cost
  - External links (e.g. booking pages)

### 💰 Budgeting

- Track travel costs, accommodation costs, and itinerary costs
- Add a buffer amount
- Automatically calculate:
  - Total cost
  - Monthly contribution until departure

### 📄 Export

- Export trips to:
  - **Excel** (using `xlsx`)
  - **PDF** (using `pdfmake`)
  - **PowerPoint** (using `pptxgenjs`)

---

## 🧠 Data Model Overview

Key domain models used in the project:

- **User**
- **Trip**
- **Location**
- **Itinerary**
- **Travel**
- **Budget**
- **Hotel / Accommodation**

Types are fully defined in `src/types` and are shared across the app to ensure consistency.

---

## 🗂️ Project Structure

```txt
src
├── api          # API & external integrations
├── assets
│   └── branding # Logos and brand assets
├── components   # Reusable UI components
├── constants    # Static values (countries, cities, etc.)
├── db           # Local database (Dexie / IndexedDB)
├── pages        # Route-level pages
├── types        # TypeScript domain models
└── utils        # Helpers (PDF, PPT, formatting, calculations)
```

---

## 🛠️ Tech Stack

- Frontend
  - React 19
  - TypeScript
  - Vite
  - React Router
- UI & Styling
  - Mantine
  - Emotion
  - Fontsource (Inter, Chango)
- State & Data
  - Zustand – state management
  - Dexie – IndexedDB wrapper
- Utilities
  - Day.js – date handling
  - Axios – HTTP requests
  - xlsx – Excel exports
  - pdfmake – PDF generation
  - pptxgenjs – PowerPoint generation

---

## Running the Project Locally

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

```bash
// Install dependencies
npm install

// Start development server
npm run dev

// The app will be available at:
http://localhost:5173
```

## 🧪 Status

- ✅ Core trip, location, itinerary & budget models
- ✅ Local persistence with IndexedDB
- ✅ Excel, PDF & PowerPoint exports
- 🚧 Authentication & backend integration (planned)
- 🚧 Sharing & collaboration features (planned)

## 👤 Author

Tendani Netshitenzhe
@TendaniN
