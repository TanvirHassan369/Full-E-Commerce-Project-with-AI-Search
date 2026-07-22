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
- Backend server running (see [Server README](../../ECommerce\(SERVER\)/Server/README.md))

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

## Related Repositories

- ⚙️ [Server (Backend API)](../../ECommerce\(SERVER\)/Server/README.md)
- 📊 [Admin Dashboard](../../ECommerce\(Dashboard\)/ecommerce-dashboard-template/README.md)
