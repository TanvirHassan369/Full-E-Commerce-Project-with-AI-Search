# Daily Bazar — E-Commerce Frontend (Client)

Customer-facing React storefront for **Daily Bazar**, a full-stack Bangladeshi e-commerce platform. Supports product browsing with AI-powered search, cart management, SSLCommerz & COD checkout, order tracking, and a 7-day return system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| State Management | Redux Toolkit + Redux Persist |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Payment | SSLCommerz (redirect flow) |
| Icons | Lucide React, React Icons |
| Notifications | React Toastify |

---

## Features

### Authentication
- OTP-based email verification on registration (10-minute expiry)
- JWT auth stored in HTTP-only cookie
- Forgot password via email reset link
- Update profile with avatar upload
- Change password (current + new)

### Product Browsing
- Filter by price range, star rating (1–5), availability (in stock / limited / out of stock), and category
- Full-text search via search bar
- AI-powered semantic search using Gemini (via backend) with keyword fallback
- Product detail page with multi-image gallery, zoom lightbox (keyboard navigation + thumbnails)
- Size selector for Fashion products
- Stock indicator (in stock / low stock / out of stock)
- Discount price with percentage badge
- Reviews tab — only purchasers can leave reviews

### Cart & Checkout
- Persistent cart via Redux Persist (survives page refresh)
- Per-item quantity controls with stock limit enforcement
- 5% tax + ৳100 shipping (free shipping over ৳5000)
- Two payment methods:
  - **SSLCommerz** — redirects to payment gateway (card, mobile banking)
  - **Cash on Delivery (COD)** — pay on arrival
- BD phone number validation (`01XXXXXXXXX` format)
- Post-payment invoice download (print-ready HTML, opens in new tab)

### Orders & Returns
- Order history with status filter tabs (Processing / Shipped / Delivered / Cancelled / Returned)
- Collapsible order detail with item images, size, price breakdown, shipping address
- 7-day return request window (from `paid_at` date)
- Return reasons: Damaged product, Wrong item, Not as described, Changed mind, Other
- Return status tracking (Pending / Approved / Rejected) with admin notes

### Other Pages
- **Home** — Hero slider, category grid, New Arrivals & Top Rated product sliders, feature section, newsletter signup
- **About** — Brand values and story
- **Contact** — Login-gated form, email locked to registered address
- **FAQ** — Accordion with 6 entries covering payments, shipping, returns
- **404** — Custom not found page

---

## Project Structure

```
Client/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── Home/            # HeroSlider, CategoryGrid, ProductSlider
│   │   │                    # FeatureSection, NewsletterSection
│   │   ├── Layout/          # Navbar, Footer, CartSidebar, LoginModal
│   │   │                    # ProfilePanel, SearchOverlay, Sidebar
│   │   └── Products/        # ProductCard, Pagination
│   │                        # AISearchModal, ReviewsContainer
│   ├── pages/               # Home, Products, ProductDetail, Cart
│   │                        # Payment, Orders, PaymentSuccess
│   │                        # PaymentFail, PaymentCancel, About
│   │                        # Contact, FAQ, NotFound
│   ├── store/
│   │   └── slices/          # authSlice, productSlice, cartSlice
│   │                        # orderSlice, popupSlice
│   ├── contexts/            # ThemeContext (dark/light mode)
│   ├── lib/                 # Axios instance
│   ├── data/                # Static category list
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Backend server running (see [Server README](https://github.com/TanvirHassan369/E-Commerce-with-AI-Powerd-Search-Backend/blob/main/README.md))

### Installation

```bash
# Navigate to client folder
cd "E-Commerce(CLIENT)/Client"

# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at `http://localhost:5173`

### Environment Variables

Create a `.env` file inside `Client/`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---
# Daily Bazar — Backend Server

REST API for **Daily Bazar**, a full-stack Bangladeshi e-commerce platform. Built with Node.js and Express, backed by PostgreSQL. Handles auth (OTP + JWT), products with Cloudinary image storage, SSLCommerz payment, order lifecycle, 7-day return system, newsletter, and contact messages.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js v5 |
| Database | PostgreSQL (`pg`) |
| Authentication | JWT (HTTP-only cookie) + OTP email |
| Password Hashing | Bcrypt |
| Image Storage | Cloudinary |
| Payment Gateway | SSLCommerz (`sslcommerz-lts`) |
| Email | Nodemailer |
| File Upload | express-fileupload |
| AI Search | Google Gemini API |
| Config | dotenv |

---

## Features

### Auth
- OTP-based email verification on registration (6-digit, 10-min expiry)
- Resend OTP support
- JWT sent as HTTP-only cookie, prevents email enumeration on forgot password
- Secure password reset via tokenized email link (SHA-256 hashed token in DB)
- Profile update with local avatar upload
- BD phone validation (`/^01[3-9]\d{8}$/`)

### Products
- Full CRUD (Admin only for create/update/delete)
- Multi-image upload to Cloudinary with selective deletion on update
- Filters: availability (in/limited/out-of-stock), price range, category (ILIKE), rating threshold, full-text search
- Pagination with configurable `limit` and `page`
- Response includes `newProducts` (last 30 days) and `topRatedProducts` (ratings ≥ 4.5)
- Reviews: only users with a paid order for that product can review; average rating auto-recalculated on post/delete
- Newsletter subscribers notified by email when a discount is added or changed (fire-and-forget)

### AI Search
- Endpoint: `POST /api/v1/products/ai-search`
- Keyword pre-filter fetches up to 100 candidate products from PostgreSQL
- Gemini does semantic re-ranking on the candidates
- Falls back to keyword results if Gemini is unavailable

### Orders
- Supports **SSLCommerz** (online) and **Cash on Delivery**
- Order total: `subtotal + 5% tax + ৳100 shipping` (free shipping over ৳5000)
- Stock deducted at payment confirmation (online) or at delivery mark (COD)
- Status flow: `Processing → Shipped → Delivered → (Returned | Cancelled)`
- On `Cancelled`: restores stock + marks payment `Refunded` (online paid) or `Cancelled` (COD pending)
- On `Delivered` for COD: marks payment `Paid`, sets `paid_at`, deducts stock
- IDOR protection: users can only fetch their own orders

### Payments (SSLCommerz)
- Initiates session, saves `tran_id` as `payment_intent_id`
- Callbacks: `success` (validates `val_id` with SSLCommerz API — never fails open), `fail`, `cancel`, `ipn`
- Idempotent success handler — skips re-processing already-paid transactions

### Returns
- 7-day return window from `paid_at` (falls back to `created_at`)
- One return request per order, only for `Delivered` orders
- Approval runs a PostgreSQL transaction: sets order → `Returned`, payment → `Refunded`, restores stock; rolls back on error

### Newsletter
- Public subscribe endpoint (email dedup)
- Admin: view all subscribers

### Contact
- Auth-required; submitted email must match `req.user.email`
- Admin: list, mark as read, delete messages

---

## API Reference

### Auth — `/api/v1/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Register + send OTP |
| POST | `/register/verify-otp` | — | Verify OTP, issue JWT |
| POST | `/register/resend-otp` | — | Resend OTP |
| POST | `/login` | — | Login, issue JWT |
| GET | `/me` | User | Get current user |
| GET | `/logout` | User | Clear JWT cookie |
| POST | `/password/forgot` | — | Send reset email |
| PUT | `/password/reset/:token` | — | Reset password |
| PUT | `/password/update` | User | Change password |
| PUT | `/profile/update` | User | Update name/email/phone/avatar |

### Products — `/api/v1/products`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | — | List products (filters + pagination) |
| GET | `/singleProduct/:id` | — | Product detail with reviews |
| POST | `/admin/create` | Admin | Create product (multipart) |
| PUT | `/admin/update/:id` | Admin | Update product (multipart) |
| DELETE | `/admin/delete/:id` | Admin | Delete product + Cloudinary images |
| PUT | `/post-new/review/:id` | User | Post or update review |
| DELETE | `/delete/review/:id` | User | Delete own review |
| POST | `/ai-search` | User | Gemini AI semantic search |

### Orders — `/api/v1/orders`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/new` | User | Place order (Online or COD) |
| GET | `/me` | User | Fetch own orders |
| GET | `/:orderId` | User | Fetch single order (IDOR-safe) |
| GET | `/admin/getall` | Admin | All orders |
| PUT | `/admin/update/:orderId` | Admin | Update order status |
| DELETE | `/admin/delete/:orderId` | Admin | Delete order |

### Payments — `/api/v1/payment`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/initiate` | User | Start SSLCommerz session |
| POST/GET | `/success` | — | Payment success callback |
| POST/GET | `/fail` | — | Payment fail callback |
| POST/GET | `/cancel` | — | Payment cancel callback |
| POST | `/ipn` | — | Instant Payment Notification |

### Returns — `/api/v1/returns`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/:orderId` | User | Submit return request |
| GET | `/my/requests` | User | Own return requests |
| GET | `/admin/all` | Admin | All return requests |
| PUT | `/admin/:returnId` | Admin | Approve or reject return |

### Admin — `/api/v1/admin`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/getallusers` | Admin | Paginated user list |
| DELETE | `/deleteuser/:id` | Admin | Delete user + Cloudinary avatar |
| GET | `/fetch/dashboard-stats` | Admin | Full analytics payload |
| GET | `/fetch/report?from=&to=` | Admin | Date-range report |

### Newsletter — `/api/v1/newsletter`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/subscribe` | — | Subscribe email |
| GET | `/subscribers` | Admin | List all subscribers |

### Contact — `/api/v1/contact`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/submit` | User | Submit contact message |
| GET | `/admin/all` | Admin | All messages |
| PUT | `/admin/:messageId/read` | Admin | Mark as read |
| DELETE | `/admin/:messageId` | Admin | Delete message |

---

## Project Structure

```
Server/
├── config/           # cloudinaryConfig.js, config.env (gitignored)
├── controllers/      # authController, productController, orderControllers
│                     # paymentController, adminController, returnController
│                     # newsletterController, contactController
├── database/         # db.js (PostgreSQL pool)
├── middlewares/      # authMiddlewares (isAuthenticated, authorizeRoles)
│                     # errorMiddlewares, catchAsyncError
├── models/           # newsletterTable.js (table creation)
├── router/           # one file per resource
├── utils/            # createTables, jwtToken, generatePaymentUrl
│                     # generateResetPasswordToken, sendemail
│                     # getAIRecommendation, email templates
├── uploads/          # temp files (gitignored)
├── app.js            # Express setup, route mounting
└── server.js         # Entry point
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database (local or hosted, e.g. Neon / Supabase / Railway)

### Installation

```bash
cd "ECommerce(SERVER)/Server"
npm install
npm run dev        # nodemon server.js
```

Server runs at `http://localhost:5000`

### Environment Variables

Create `config/config.env`:

```env
# Server
PORT=5000
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password

# SSLCommerz
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_SANDBOX=true      # false for production

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

---

## Database Tables

Tables are auto-created on server startup via `createTables()`:

| Table | Description |
|---|---|
| `users` | Registered users with OTP, reset token, role, avatar |
| `products` | Products with JSONB images, sizes, discount_price, ratings |
| `reviews` | Per-product user reviews |
| `orders` | Order header with status, total, tax, shipping, paid_at |
| `order_items` | Line items with title, image, size, price snapshot |
| `shipping_info` | Delivery address per order |
| `payments` | Payment record with type, status, transaction ID |
| `return_requests` | Return requests with 7-day window enforcement |
| `contact_messages` | User contact form submissions |
| `newsletter_subscribers` | Email subscribers |

---
# Daily Bazar — Admin Dashboard

React-based admin panel for **Daily Bazar**. Provides full control over products, orders, users, return requests, contact messages, and newsletter subscribers. Includes a live analytics dashboard powered by Recharts and a date-range report generator.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| State Management | Redux Toolkit |
| Routing | React Router v7 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| HTTP Client | Axios |
| Rich Text Editor | Jodit React + `@uiw/react-md-editor` |
| Icons | Lucide React, React Icons |
| Notifications | React Toastify |

---

## Features

### Authentication
- Admin login / logout via JWT (HTTP-only cookie, same API as client)
- `loadUser` on app mount to restore session
- Admin profile update with avatar upload

### Dashboard — Analytics Overview
Powered by `GET /api/v1/admin/fetch/dashboard-stats`:
- **Total Revenue** — sum of all paid orders
- **Today's Revenue** vs Yesterday's Revenue
- **Monthly Revenue Growth Rate** (current vs previous month, %)
- **Order Status Counts** — Processing, Shipped, Delivered, Cancelled, Returned
- **Monthly Sales Line Chart** (Recharts)
- **Top 5 Selling Products** table with image, category, units sold
- **Low Stock Alerts** — products with stock ≤ 5
- **New Users This Month**
- **Newsletter Subscriber Count**

### Report Generator
- Date-range picker (`from` / `to`)
- Calls `GET /api/v1/admin/fetch/report`
- Returns: total revenue, total orders, order status breakdown, new users, daily sales chart, top 10 products, return statistics (total / pending / approved / rejected)

### Products
- List all products with image, price, stock, category
- **Create** — multipart form with Jodit rich text editor for description, Cloudinary upload, size variants (for Fashion), discount price
- **Update** — edit existing product, add/remove individual images (syncs Cloudinary), update sizes
- **Delete** — removes product and all Cloudinary images
- View product modal

Redux slice: `fetchProducts`, `createProduct`, `updateProduct`, `deleteProduct`

### Orders
- Full order list with payment status, shipping info
- Update order status: Processing → Shipped → Delivered → Cancelled
- Status update logic on backend:
  - `Cancelled` restores stock + marks payment Refunded/Cancelled
  - `Delivered` (COD) marks payment Paid, deducts stock
- Delete order

### Return Requests
- View all return requests with buyer info, order total, shipping address, reason, description
- **Approve** — sets order to Returned, payment to Refunded, restores stock (DB transaction)
- **Reject** — with optional admin note shown to customer
- Status badges: Pending / Approved / Rejected

### Users
- Paginated user list (10 per page)
- Delete user (also removes Cloudinary avatar)

### Contact Messages
- View all messages with read/unread status
- Mark as read
- Delete message

### Newsletter Subscribers
- View all subscriber emails with subscription date

### Admin Profile
- Update name, email, phone, avatar

---

## Redux Store

| Slice | State | Async Actions |
|---|---|---|
| `authSlice` | `user`, `isAuthenticated` | `loginAdmin`, `loadUser`, `logoutAdmin`, `updateAdminProfile` |
| `productsSlice` | `products`, `loading` | `fetchProducts`, `createProduct`, `updateProduct`, `deleteProduct` |
| `orderSlice` | `orders`, `returnRequests` | `fetchAllOrders`, `updateOrderStatus`, `deleteOrder`, `fetchAllReturnRequests`, `updateReturnRequest` |
| `adminSlice` | `stats`, `users`, `subscribers` | `fetchDashboardStats`, `fetchAllUsers`, `deleteUser`, `fetchAllSubscribers` |
| `extraSlice` | modal open flags | `toggleCreateProductModal`, `toggleUpdateProductModal`, `toggleViewProductModal` |

---

## Project Structure

```
ecommerce-dashboard-template/
├── public/
├── src/
│   ├── components/       # Reusable UI (charts, tables, modals, sidebar)
│   ├── pages/            # Dashboard, Products, Orders, Returns
│   │                     # Users, Messages, Subscribers, Profile
│   ├── store/
│   │   ├── index.js      # Redux store
│   │   └── slices/       # authSlice, productsSlice, orderSlice
│   │                     # adminSlice, extraSlice
│   ├── lib/
│   │   └── axiosInstance.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Backend server running (see [Server README](https://github.com/TanvirHassan369/E-Commerce-with-AI-Powerd-Search-Backend/blob/main/README.md))
- Admin account in the database (`role = 'Admin'`)

### Installation

```bash
cd "ECommerce(Dashboard)/ecommerce-dashboard-template"
npm install
npm run dev
```

Dashboard runs at `http://localhost:5174`

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## Pages Summary

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Admin authentication |
| Dashboard | `/` | Analytics overview + charts |
| Products | `/products` | CRUD with rich text editor |
| Orders | `/orders` | Order management + status updates |
| Returns | `/returns` | Approve / reject return requests |
| Users | `/users` | View + delete registered users |
| Messages | `/messages` | Contact form inbox |
| Subscribers | `/subscribers` | Newsletter subscriber list |
| Profile | `/profile` | Update admin profile |
