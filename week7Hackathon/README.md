# POS & Inventory Management System

A production-style **Point of Sale + Raw-Material–Driven Inventory** system.

## Architecture

```
Next.js (App Router) → RTK Query → NestJS API → MongoDB
```

## Features

- **Raw Materials Management** — CRUD with unit (g, ml, pcs, kg, l), quantity, and low-stock alerts
- **Product Recipe System** — define products as compositions of raw materials with exact quantities
- **Auto Stock Calculation** — product availability is calculated from raw materials, never stored manually
- **POS Flow** — add products to cart, adjust quantity (capped by availability), complete sale
- **Backend Stock Deduction** — on sale completion, raw materials are deducted atomically on the server
- **Dashboard** — revenue, order count, low-stock alerts, 7-day revenue chart, top-selling products
- **Order History** — full order log with expandable line items

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | Next.js 16 (App Router)           |
| API      | RTK Query (Redux Toolkit)         |
| State    | Redux + cartSlice                 |
| UI       | Material UI (MUI v6)              |
| Charts   | Recharts                          |
| Backend  | NestJS 11                         |
| Database | MongoDB (Mongoose)                |

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally on `mongodb://localhost:27017` **or** set `MONGODB_URI` env var

### Backend

```bash
cd backend
cp .env.example .env       # already created as .env
npm install
npm run start:dev          # runs on http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
# frontend runs on port 3001 so it doesn't clash with the backend
npm run dev -- -p 3001     # runs on http://localhost:3001
```

## API Endpoints

| Method | Path                    | Description                          |
|--------|-------------------------|--------------------------------------|
| GET    | /api/dashboard          | Full dashboard data                  |
| GET    | /api/raw-materials      | List all raw materials               |
| POST   | /api/raw-materials      | Create raw material                  |
| PATCH  | /api/raw-materials/:id  | Update raw material (restock etc.)   |
| DELETE | /api/raw-materials/:id  | Delete raw material                  |
| GET    | /api/raw-materials/low-stock | Materials below minimum level   |
| GET    | /api/products           | List products with availability      |
| POST   | /api/products           | Create product with recipe           |
| PATCH  | /api/products/:id       | Update product                       |
| DELETE | /api/products/:id       | Delete product                       |
| GET    | /api/orders             | Order history                        |
| POST   | /api/orders             | Place a new order (deducts stock)    |
| GET    | /api/orders/summary     | Aggregated sales summary             |

## Key Business Rules

1. **Stock is never stored on products** — it is always calculated from raw materials
2. **Sales are rejected** if any required raw material is insufficient
3. **Stock deduction happens on the backend** — frontend never manipulates inventory numbers
4. **Cart quantity is capped** by the server-calculated available stock
