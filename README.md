# 🛍️ Mini E-Commerce Website

This is a comprehensive, full-stack **MERN (MongoDB, Express, React, Node.js)** e-commerce application developed as an internship project for **TEN (The Entrepreneurship Network)**. It features an interactive shopping catalog, persistent cart management, role-based authorization (User/Vendor), mock checkout, order tracking, and an integrated **2-step email OTP verification** powered by **EmailJS**.

---

## 🚀 Live Demo & API URLs
- **Frontend App:** [https://mini-ecommerce-website-lrgz.vercel.app](https://mini-ecommerce-website-lrgz.vercel.app)
- **Backend API URL:** `https://mini-ecommerce-website-lrgz.vercel.app/api`

---

## ✨ Features

### 👤 Customer (User) Features
- **Dynamic Product Browsing:** View complete product catalog with instant search, filters (by Category), and pricing sort (Low to High / High to Low).
- **Persistent Shopping Cart:** Add items to cart, dynamically modify quantity, view subtotal, and remove items.
- **Simulated Checkout:** Smooth checkout process that logs orders and clears the shopping cart.
- **Order Tracking:** Track past and current orders along with real-time status updates (Pending, Processing, Shipped, Delivered).

### 🏪 Vendor Features
- **Product Inventory Management:** Add new products (title, price, description, category, stock, image link), edit existing products, and delete inventory items.
- **Vendor Dashboard:** View all vendor-specific products and check stock availability.
- **Order Fulfillment Dashboard:** View and manage customer orders containing vendor items, with capabilities to update order processing status.

### 🔒 Security & Authentication
- **Secure Password Hashing:** Uses `bcryptjs` for encryption during registration.
- **Token-Based Authentication:** Employs JWT (JSON Web Tokens) stored securely in HTTP-only cookies.
- **2-Step Login Verification:** Enhances account security by generating and dispatching a **4-digit OTP** via **EmailJS** to the user's email during login.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **State Management:** Redux Toolkit + React Redux
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Navigation:** React Router DOM (v7)
- **API Communication:** Axios
- **Notifications:** React Hot Toast / Sonner

### Backend
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose ORM)
- **Authentication:** jsonwebtoken, cookie-parser, bcryptjs
- **Validation:** validator

---

## ⚡ Installation & Setup

Make sure you have Node.js (v18+) and `pnpm` installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/Gopal-Kundu/Mini-Ecommerce-website.git
cd Mini-Ecommerce-website
```

### 2. Configure Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_uri
   CORS_ORIGIN=http://localhost:5173
   JWT_SECRET=your_super_secret_jwt_key
   SECRET_KEY=your_super_secret_jwt_key
   
   # EmailJS Settings
   EMAILJS_SERVICE_ID=service_j185gcr
   EMAILJS_TEMPLATE_ID=template_bh6y4ah
   EMAILJS_PUBLIC_KEY=55GjyR5HxwazD17Dl
   EMAILJS_ACCESS_TOKEN=your_emailjs_private_access_token (optional, required if strict mode is ON)
   ```
4. Start the backend development server:
   ```bash
   pnpm run dev
   ```

### 3. Configure Frontend
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Update `frontend/src/config.ts` to switch between Local and Production API endpoints:
   - For local development:
     ```typescript
     export const BASE_URL = 'http://localhost:5000/api';
     ```
   - For production deployment:
     ```typescript
     export const BASE_URL = 'https://mini-ecommerce-website-lrgz.vercel.app/api';
     ```
4. Start the Vite development server:
   ```bash
   pnpm run dev
   ```

---

## 🔌 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
- `POST /signup` — Register a new customer or vendor.
- `POST /login` — Initiate login (sends OTP) or submit credential + 4-digit OTP to complete authentication.
- `POST /logout` — Log out the user and clear session cookies.
- `GET /me` — Retrieve active profile details.

### 📦 Products (`/api/products`)
- `GET /` — Browse and query all products.
- `POST /` — Create a new product (Vendor only).
- `GET /vendor` — Fetch all products belonging to the logged-in vendor.

### 🛒 Cart (`/api/cart`)
- `GET /` — Get the current user's cart contents.
- `POST /` — Add a product to the cart.
- `DELETE /` — Clear all items from the cart.
- `PUT /:productId` — Update item quantity in the cart.
- `DELETE /:productId` — Remove a specific item from the cart.

### 🧾 Orders (`/api/orders`)
- `POST /checkout` — Place an order for items currently in the cart.
- `GET /my-orders` — View the user's order history and statuses.
- `GET /vendor` — View all orders placed for the logged-in vendor's items.
- `PUT /vendor/:orderId` — Update order fulfillment status (Vendor only).

---

## 📧 EmailJS Dashboard Setup Guidelines

To ensure the 4-digit OTP code delivers from your backend, make sure you configure your EmailJS account dashboard as follows:

1. **Enable API Access from Servers:**
   - In your **EmailJS Dashboard** → **Account** → **Security**.
   - Check/toggle **ON**: **"Allow API requests from non-browser environments"**.

2. **Access Token (Strict Mode):**
   - If your EmailJS account operates in Strict Mode, copy your **Access Token** from the Security page.
   - Insert it into the backend `.env` file under the key `EMAILJS_ACCESS_TOKEN`.

3. **Email Template Configuration (`template_bh6y4ah`):**
   - In **Email Templates** → **Settings**, map your **"To Email"** input to use `{{to_email}}` or `{{email}}`.
   - The backend includes the following parameters in `template_params`:
     - `{{user_name}}` — Recipient's name.
     - `{{otp}}` — 4-digit OTP verification code.
     - `{{to_email}}` / `{{email}}` — Recipient's email address.
