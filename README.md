# ✈️ Plan-Trip

<p align="center">
  <img src="src/assets/branding/plan-trip-high-resolution-logo-transparent.svg" alt="Plan-Trip Logo" width="180" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.2.0-blue.svg" alt="Version" />
  <img src="https://img.shields.io/badge/status-active%20development-yellow.svg" alt="Status" />
  <img src="https://img.shields.io/badge/react-19.x-61dafb.svg" alt="React" />
  <img src="https://img.shields.io/badge/typescript-strict-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/license-TBD-lightgrey.svg" alt="License" />
</p>

<p align="center">
  <a href="https://tendanin.github.io/plan-trip/">
    <img src="https://img.shields.io/badge/live-demo-brightgreen" />
  </a>
</p>

**Plan-Trip** is a trip-planning web application designed to make organising complex trips easier and more structured.
It allows users to plan trips with multiple locations, manage itineraries, and track budgets — all in one place.

> **Current version:** `0.3.0`
> 🚧 This project is under active development.

---

## 🌍 Project Goal

Planning a trip often involves juggling dates, locations, activities, and budgets across multiple tools.
**Plan-Trip** simplifies this by providing:

- A single source of truth for trip planning
- Real-time synced data across devices
- Clear visibility of schedules and costs
- Easy export of plans (Excel, PDF, PowerPoint)

---

## ✨ Features

### 🧳 Trips

- Create trips with start and end dates
- Each trip contains:
  - Multiple locations
  - Travel entries (flights, trains, buses, cars)
  - Budget tracking

### 📍 Locations

- Each trip can have **multiple locations**
- A location includes:
  - Country & city
  - Arrival and departure dates
  - Number of nights (auto-calculated)
  - Optional accommodation
  - Linked itinerary items

### 🗓️ Itinerary

- Detailed itinerary per location
- Each item supports:
  - Activity name & description
  - Date & time
  - Duration
  - Cost
  - External links

### 💰 Budgeting

- Track:
  - Accommodation costs
  - Itinerary costs
  - Travel costs
  - Buffer
- Automatically calculates:
  - Total trip cost
  - Monthly savings required

### 🔄 Real-time Sync (NEW)

- Powered by **Firebase Firestore**
- Changes instantly reflect across sessions
- Zustand used for client-side caching + UI state

### 🔐 Authentication (NEW)

- Firebase Authentication (email/password)
- User-scoped data access
- Secure backend enforced via Firestore rules

### 📄 Export

- Export trips to:
  - **Excel** (`xlsx`)
  - **PDF** (`pdfmake`)
  - **PowerPoint** (`pptxgenjs`)

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

This project uses **feature-based architecture**

```txt
src
│
├─ api            # Firebase interaction layer (CRUD logic)
├─ assets
├─ components
├─ constants
├─ db             # Zustand store (client state)
├─ hooks
├─ layouts
│   ├─ ProtectedLayout.tsx
│   └─ AppLayout.tsx
│
├─ pages
│   ├─ login.page.tsx
│   ├─ register.page.tsx
│   ├─ logout.page.tsx
│   ├─ trips.page.tsx
│   ├─ trip.page.tsx
│   ├─ location.page.tsx
│   ├─ budget.page.tsx
│   ├─ countries.page.tsx
│   ├─ accommodation.page.tsx
│   ├─ help.page.tsx
│   └─ home.page.tsx
│
├─ types
└─ utils
```

---

## 🛠️ Tech Stack

- Frontend
  - React 19
  - TypeScript
  - Vite
  - React Router (Declarative Routing)
- UI & Styling
  - Mantine
  - Emotion
  - Fontsource (Inter, Chango)
- State & Data
  - Zustand – state management
  - Firebase Firestore – backend database
  - Firebase Auth – authentication
- Utilities
  - Day.js – date handling
  - Axios – HTTP requests
  - xlsx – Excel exports
  - pdfmake – PDF generation
  - pptxgenjs – PowerPoint generation

---

## 🔐 Security Model (NEW)

- All data is **user-scoped**
- Firestore security rules enforce:

  - Users can only access their own trips
  - No cross-user reads/writes
  - Budget, location, itinerary tied to `tripId`
- Sensitive operations validated server-side via rules

---

## Running the Project Locally

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Setup

```bash
npm install
npm run dev
```

App runs at:

```bash
http://localhost:5173
```

---

## 🧪 Status

- ✅ Trips, locations, itinerary, budgets
- ✅ Firebase backend integration
- ✅ Authentication system
- ✅ Real-time updates
- ✅ Export functionality
- 🚧 Collaboration & sharing
- 🚧 Advanced budgeting insights

## 👤 Author

**Tendani Netshitenzhe**
[@TendaniN](https://github.com/TendaniN)
