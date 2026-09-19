# AmarBazaar - Enterprise Bangladeshi Business E-Commerce Platform

AmarBazaar is a complete, modern, production-ready business e-commerce platform engineered specifically for the Bangladeshi retail market. Built as a high-performance alternative to WordPress/WooCommerce, it offers an administrative interface, native bilingual support (English & Bengali), honest payment gateway architecture, and decoupled service layers ready to connect to real backend infrastructure.

---

## 🇧🇩 Bangladeshi Localization & Business Features

- **Bilingual Experience**: Instant 1-click toggle between English and বাংলা with native Bengali numerals (`০-৯`) and localized typography (Hind Siliguri + Plus Jakarta Sans).
- **Currency & Pricing**: Full BDT (৳) pricing with discount badges, savings calculation, and formatted unit totals.
- **Geographic Data Hierarchy**: Complete directory of Bangladesh's 8 Divisions, 64 Districts, and administrative Upazilas/Thanas for address entry.
- **Shipping Zone Engine**:
  - Inside Dhaka City: ৳60 (24–48 Hours)
  - Outside Dhaka / Nationwide: ৳120 (2–4 Business Days)
- **Courier Logistics Ready**: Prepared integration contracts for Pathao Courier, Steadfast Logistics, and RedX with tracking number assignment.

---

## 💳 Payment Gateway Architecture & Production Honesty

In strict compliance with production engineering standards:
- **Cash on Delivery (COD)**: Fully live and operational. Orders are recorded with pending payment status and authentic order tracking IDs (`AB-XXXXXX`).
- **bKash Tokenized Checkout**: Architecture stubbed with merchant API endpoints (`/api/v1/payments/bkash/create`). In preview mode, it transparently notifies the customer that merchant keys are required rather than simulating fake payment success.
- **Nagad & Rocket**: Standard merchant PGW flow ready for credentials injection.

### Connecting Live Payment Gateways

When deploying to a live server:
1. **bKash Tokenized Checkout**:
   - Provide `BKASH_APP_KEY`, `BKASH_APP_SECRET`, `BKASH_USERNAME`, `BKASH_PASSWORD` in your backend environment.
   - Update `paymentService.ts` to call your backend endpoint `POST /api/v1/payments/bkash/create` which invokes `https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create`.
2. **Nagad Merchant API**:
   - Configure your Merchant ID and PG Private Key. Forward redirect responses to Nagad's payment verification endpoint.
3. **SSLCommerz / Aamarpay**:
   - Add session initiation redirect inside `initiatePayment()` for multi-gateway aggregation.

---

## 📦 Connecting Courier APIs (Pathao, Steadfast, RedX)

In `orderService.ts`, the order dispatcher creates orders with automated courier routing:
- **Inside Dhaka**: Defaults to Pathao Courier / RedX City Express.
- **Outside Dhaka**: Defaults to Steadfast Courier / Paperfly Nationwide.

To connect live delivery webhooks:
- **Pathao Merchant API**: Call `POST https://api-hermes.pathao.com/aladdin/api/v1/orders` passing customer name, phone, district, and consignment cash collection amount.
- **Steadfast Logistics API**: Call `POST https://portal.steadfast.com.bd/api/v1/create_order` with invoice ID and receiver details.

---

## 🗄️ Database & Authentication Architecture

All data operations are handled via decoupled service classes:
- `productService`: Catalog management, filtering, stock level updates.
- `orderService`: Order lifecycle management (`pending` ➔ `confirmed` ➔ `processing` ➔ `shipped` ➔ `delivered` ➔ `cancelled`).
- `cartService`: Local persistence, cart totals, zone delivery rate, coupon calculation.
- `authService`: User registration, phone-based login, profile and address management.
- `wishlistService`: Customer wishlist synchronization.

### Switching to Firebase or Cloud SQL
Simply replace the internal storage methods in `src/services/` with Firestore collections or REST/GraphQL API endpoints. All UI components communicate through the unified `AppContext` hooks without direct coupling to storage implementations.

---

## 🛠️ Tech Stack & Tooling

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom responsive layout and optical hierarchy
- **Icons**: Lucide React
- **Localization**: Custom i18n context with full English and Bangla dictionaries
- **Build System**: Vite with production bundling
