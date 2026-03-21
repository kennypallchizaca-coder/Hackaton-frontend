# 🚀 KuriPay — Enterprise Crypto Payment & Trading Platform

**KuriPay** is a production-grade Full-Stack crypto platform that bridges traditional finance (Fiat) with the Web3 ecosystem. It unifies trading, Lightning Network payments, and compliance tools in a single professional-grade interface.

> **Stack:** React 18 + TypeScript · NestJS · Prisma + PostgreSQL · Redis · Tailwind CSS · JWT Auth

---

## 🌐 Live Routes

| URL | Description |
|-----|-------------|
| `/` | Public Landing Page |
| `/login` | Login (JWT authentication) |
| `/register` | New user registration |
| `/app` | Trading Dashboard (protected) |
| `/app/payments` | POS Terminal (protected) |
| `/app/transactions` | Transaction History (protected) |
| `/app/compliance` | Compliance & KYT Panel (protected) |
| `/app/settings` | User Settings (protected) |

---

## 🏗️ Architecture

```
Frontend (React 18 + TS + Vite)
         ↕ HTTP/JWT (Axios interceptors)
Backend  (NestJS modular API)
         ↕ Prisma ORM
Database (PostgreSQL + Redis cache)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 + TypeScript |
| Bundler | Vite (HMR dev server) |
| Styling | Tailwind CSS (navy/slate palette) |
| State | Zustand (auth session) |
| Router | React Router DOM v6 |
| HTTP | Axios with JWT auto-refresh |
| Charts | Recharts |
| Backend | NestJS (modular REST API) |
| ORM | Prisma → PostgreSQL |
| Cache | Redis (session + queues) |

---

## 🧩 User Roles

The entire interface adapts based on who logs in:

| Role | Access |
|------|--------|
| **Consumer** | Trading dashboard, order history, settings |
| **Merchant** | POS Terminal, trading, order history |
| **Liquidity Agent** | Trading, compliance, order management |
| **Admin** | Full access to all panels |

---

## 🕹️ Feature Guide: What Every Button Does

### 📈 Trading Terminal (`/app`)

The main exchange engine of the platform.

#### Header Bar (TickerHeader)
Displays the live BTC/USDT price, 24h change, 24h High/Low, and volumes pulled in real time.

#### Trade Mode
- **`Spot`** — The active trading mode. Allows 1:1 direct asset exchange.

#### Order Types
| Option | What it Does |
|--------|-------------|
| `Limit` | You set a specific price. The order executes only if the market reaches that price. |
| `Market` | Buys/sells instantly at the current market price. |
| `Stop-limit` | A two-step trigger: activates a Limit order once the price reaches a "stop" threshold. |

#### Order Fields
| Field | Description |
|-------|-------------|
| `Price` | In USDT — the price per BTC you're willing to trade at. |
| `Amount` | How much BTC you want to buy or sell. |
| `Total` | Auto-calculated: `Price × Amount`. |
| `% Slider` | Quickly fills the Amount field using 25%, 50%, 75%, or 100% of your available balance. |

#### Action Buttons
| Button | Action |
|--------|--------|
| `Buy BTC` (green) | Sends a buy order to the backend. Debits USDT, credits BTC. |
| `Sell BTC` (red) | Sends a sell order. Debits BTC, credits USDT. |

#### OrderBook Panel
Displays live buy (bids) and sell (asks) orders from liquidity agents, showing depth and spread.

---

### 📱 POS Terminal (`/app/payments`)

Designed for merchants to accept crypto payments in physical and digital stores.

#### Step 1 — Configure Payment
| Field | Description |
|-------|-------------|
| `Payment Amount` | Enter the value to charge the customer. |
| `SATS / USD / BTC` | Toggle selects the currency unit for the amount. USD and BTC are auto-converted to SATS internally using a fixed exchange rate. |
| `Merchant Node` | Select which store/location node receives the payment. |
| `Order ID` | Auto-generated unique identifier for this transaction (e.g. `GEN-73291`). |
| `Internal Memo` | Optional description (e.g. "Coffee × 2, sandwich"). |

#### Step 2 — How the QR Code is Generated

When you press **`Generate Terminal QR`**:

1. **Currency conversion**: if USD or BTC, converts to SATS:
   - `1 USD → 1,587 SATS` (fixed rate)
   - `1 BTC → 100,000,000 SATS`
2. **API call** → `POST /payments/create` sends `{ amount_sats, description, merchantId, currency: "BTC" }` to the NestJS backend.
3. **Backend generates** a **Lightning Network BOLT-11 invoice** (`lnbc...` payment request string) and stores it in PostgreSQL with a 15-minute expiry.
4. **Frontend receives** the invoice object with the `lightningInvoice` string.
5. **QRPaymentCard renders** the `lightningInvoice` string as a QR code using a QR generation library. The customer scans this code with any Lightning wallet (Strike, Muun, Phoenix, etc.).

#### Step 3 — Real-Time Payment Polling

Once the QR code is displayed, the frontend **polls every 3 seconds** → `GET /payments/{id}/status`.

- If the backend returns `paid` or `completed`, the terminal automatically advances to the **Receipt screen**.
- The polling stops gracefully when the component unmounts or when payment is confirmed.

#### Step 4 — Receipt Screen
Displays:
- ✅ Settlement confirmation
- Amount in SATS
- Truncated transaction ID
- `Receipt` button (for printing/export)
- `New Payment` button to reset the terminal

#### Recent Payments
A live feed at the bottom of the left panel showing the last paid/expired invoices for that merchant.

---

### 🛡️ Compliance Panel (`/app/compliance`)

#### Tab 1 — `Safety · KYT` (Know Your Transaction)
- Fetches alert records from `GET /compliance/kyt-alerts`.
- Each incoming payment is scored as `Low`, `Medium`, or `High` risk.
- **High Risk** entries are flagged in red and can trigger a block.

#### Tab 2 — `Proof of Innocence (PoI)`
If a transaction is blocked due to a KYT risk flag:
1. Click **`Generate ZK-Proof`**.
2. The frontend calls `POST /compliance/proof-of-innocence` with the transaction ID.
3. The backend generates a **Zero-Knowledge cryptographic proof** — this lets the merchant prove their funds are legitimate **without revealing all personal information**.
4. The proof can be submitted to regulators to unblock the payment.

#### Tab 3 — `Audit Trail`
- Fetches all events from `GET /audit/events` (admin/auditor only).
- Displays an **immutable log** of who did what, when, and on which record.
- Non-admin users receive an empty list (403 handled gracefully).

---

### ⚙️ Settings (`/app/settings`)
Manage your user profile, notification preferences, and security keys.

---

## 📁 Project Structure

```
src/
 ├─ api/                 # Axios base client with JWT interceptors
 ├─ components/
 │   ├─ auth/            # ProtectedRoute guard
 │   ├─ common/          # SEO, Icons
 │   ├─ layout/          # Sidebar, Topbar, TickerHeader
 │   └─ ui/              # QRPaymentCard, BalanceCard, inputs
 ├─ features/
 │   ├─ auth/            # Login, Register, authStore (Zustand)
 │   ├─ compliance/      # KYT, ZK-Proof, Audit Trail
 │   ├─ consumer/        # Consumer dashboard & wallets
 │   ├─ landing/         # Public landing page
 │   ├─ liquidity/       # Liquidity agent dashboard
 │   ├─ merchant/        # Merchant dashboard & metrics
 │   ├─ payments/        # POS terminal, paymentService, QR flow
 │   ├─ settings/        # User settings page
 │   ├─ shared/          # SystemFlowMap (shared across dashboards)
 │   ├─ trading/         # Chart, TradePanel, OrderBook, TradingTerminal
 │   └─ wallets/         # walletsService (balance queries)
 ├─ layouts/             # DashboardLayout (Sidebar + Topbar wrapper)
 ├─ routes/              # AppRoutes (public + protected routes)
 ├─ types/               # Global TypeScript interfaces
 └─ utils/               # cn() utility (Tailwind class merging)
```

---

## 🛠️ Installation & Setup

### Requirements
- Node.js `18+`
- npm or yarn
- PostgreSQL + Redis (for backend)

### Frontend

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Set VITE_API_URL=http://localhost:3000/api/v1

# 3. Start development server
npm run dev
# → http://localhost:5173
```

### Backend

```bash
cd ../Hackaton-Backend

npm install
cp .env.example .env
# Configure DATABASE_URL, REDIS_URL, JWT_SECRET

npx prisma migrate dev
npm run start:dev
# → http://localhost:3000
```

---

## 🔌 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Returns JWT access + refresh tokens |
| `POST` | `/auth/register` | Creates a new user account |
| `GET` | `/wallets/me` | Returns user wallet balances |
| `GET` | `/transactions` | Returns paginated transaction history |
| `POST` | `/payments/create` | Creates a Lightning Network invoice |
| `GET` | `/payments/:id/status` | Polls payment status (pending/paid/expired) |
| `POST` | `/payments/:id/regenerate` | Regenerates an expired QR invoice |
| `GET` | `/compliance/kyt-alerts` | Returns KYT risk alerts |
| `POST` | `/compliance/proof-of-innocence` | Generates ZK proof for disputed tx |
| `GET` | `/audit/events` | Returns immutable audit log (admin only) |

---

## ⚡ QR Payment Flow (Sequence)

```
Merchant                 Frontend                 Backend (NestJS)
   |                        |                            |
   |-- Enter amount ------->|                            |
   |-- Select currency ---->|                            |
   |-- Press "Generate QR"->|                            |
   |                        |-- POST /payments/create -->|
   |                        |                            |-- Generate BOLT-11 invoice
   |                        |                            |-- Store in PostgreSQL
   |                        |<-- { lightningInvoice } ---|
   |                        |-- Render QR code           |
   |<-- Display QR ---------|                            |
   |                        |                            |
Customer scans QR with Lightning Wallet                  |
   |                        |                            |<-- Payment received on-chain
   |                        |-- GET /payments/:id/status-|
   |                        |<-- { status: "paid" } -----|
   |                        |-- Show Receipt screen      |
   |<-- Payment Confirmed --|                            |
```

---

## 🛡️ Standards

- **TypeScript Strict Mode** — end-to-end type safety.
- **JWT Auth with auto-refresh** — Axios interceptors handle token rotation silently.
- **Zero dead code** — all features audited and orphan files removed.
- **Responsive design** — optimized for desktop 1024px to 4K.
- **Secret masking** — API keys displayed as `sk_test_••••` on all user-facing surfaces.
