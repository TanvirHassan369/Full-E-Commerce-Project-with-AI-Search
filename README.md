# 🛒 Full-Stack E-Commerce Platform

A complete full-stack e-commerce web application with customer frontend, admin dashboard, and REST API backend.

## 🔗 Live Demo
<!-- Add your deployed links here -->
- Frontend: `coming soon`
- Dashboard: `coming soon`

---

## 🧱 Tech Stack

### Frontend (Client)
- **React 18** + **Vite**
- **Redux Toolkit** + Redux Persist (state management)
- **React Router v6** (routing)
- **Tailwind CSS** (styling)
- **Axios** (API calls)
- **Stripe** (payment integration)
- **React Toastify** (notifications)

### Backend (Server)
- **Node.js** + **Express.js**
- **PostgreSQL** + `pg` driver
- **JWT** (authentication)
- **Bcrypt** (password hashing)
- **Cloudinary** (image uploads)
- **Nodemailer** (email service)
- **SSLCommerz** + **Stripe** (payment gateways)

### Admin Dashboard
- Separate React-based admin panel

---

## ✨ Features

- User registration, login & JWT-based authentication
- Product browsing with search, filter & pagination
- Shopping cart with Redux state persistence
- Checkout with Stripe & SSLCommerz payment
- Order management & tracking
- Admin dashboard for product/order/user management
- Image upload via Cloudinary
- Email notifications via Nodemailer
- AI-powered product search
- Responsive design (mobile-friendly)

---

## 📁 Project Structure

```
├── E-Commerce(CLIENT)/     # React frontend for customers
├── ECommerce(Dashboard)/   # React admin dashboard
└── ECommerce(SERVER)/      # Node.js + Express REST API
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/ecommerce-project.git
cd ecommerce-project
```

**2. Setup Server**
```bash
cd "ECommerce(SERVER)/Server"
npm install
# Create config/config.env and add your environment variables
npm run dev
```

**3. Setup Client**
```bash
cd "E-Commerce(CLIENT)/Client"
npm install
npm run dev
```

**4. Setup Dashboard**
```bash
cd "ECommerce(Dashboard)"
npm install
npm run dev
```

### Environment Variables (Server)
Create `ECommerce(SERVER)/Server/config/config.env`:
```
PORT=5000
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
STRIPE_SECRET_KEY=your_stripe_key
```

---

## 📸 Screenshots
<!-- Add screenshots of your project here -->

---

## 👤 Author

**Your Name**  
[GitHub](https://github.com/YOUR_USERNAME) • [LinkedIn](https://linkedin.com/in/YOUR_USERNAME)
