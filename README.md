# 🛍️ Mini E-Commerce Website

This is an internship project from TEN (The Entrepreneurship Network) company. It is a full-stack MERN project.

## 📝 Project Description
The **Mini E-Commerce Website** is a lightweight, responsive online store where users can browse products, manage their shopping carts (adding items, adjusting quantities, deleting items), and experience a mock checkout process.

## ⚡ Installation & Setup

Make sure you have Node.js and `pnpm` installed on your machine.

### 1. Navigate to the project directory
```bash
cd "Mini Ecomerce Website"
```

### 2. Configure Backend Setup
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
   MONGODB_URI=mongodb://localhost:27017/mini-ecommerce
   CORS_ORIGIN=http://localhost:5173
   ```
4. Start the backend development server:
   ```bash
   pnpm run dev
   ```

### 3. Configure Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the frontend Vite development server:
   ```bash
   pnpm run dev
   ```
