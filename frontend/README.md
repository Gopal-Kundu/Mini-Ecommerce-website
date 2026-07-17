# 🛍️ Mini E-Commerce Website — Frontend Client

This is the frontend client for the **Mini E-Commerce Website** developed using React, TypeScript, Redux Toolkit, Tailwind CSS, and Vite.

---

## ⚡ Tech Stack & Tools
- **Core Library:** React 19
- **Type Checking:** TypeScript
- **State Management:** Redux Toolkit (auth, cart)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`) with rich glowing dark aesthetics
- **Routing:** React Router DOM (v7)
- **HTTP Client:** Axios with credentialed requests
- **Toasts & Feedback:** Sonner, React Hot Toast
- **Icons:** Lucide React

---

## 📂 Project Structure

```bash
frontend/src/
├── components/          # Reusable UI elements (Navbar, layouts)
├── store/               # Redux slices (authSlice, cartSlice, store config)
├── pages/               # Page components
│   ├── Landing.tsx      # Welcome / Home landing page
│   ├── Login.tsx        # Login page with password and 4-digit OTP step
│   ├── Signup.tsx       # Registration page (User or Vendor)
│   ├── products.tsx     # Product catalog search, filter, and sorting
│   ├── Cart.tsx         # Cart review, quantity updates, and simulated checkout
│   ├── TrackOrders.tsx  # Customer orders history and tracking
│   ├── VendorAddProduct.tsx # Vendor interface to create new product catalog items
│   ├── VendorProducts.tsx   # Vendor dashboard to view and manage inventory
│   └── VendorOrders.tsx     # Vendor management tool to update order statuses
├── config.ts            # API URL switchboards
├── main.tsx             # Application mount point
└── App.tsx              # Router declarations and layouts
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
Ensure you are inside the `frontend/` directory and run:
```bash
pnpm install
```

### 2. Configure Backend API URL
Open `src/config.ts` and set the backend target URL:
```typescript
// Local backend server
export const BASE_URL = 'http://localhost:5000/api';

// Production backend server
// export const BASE_URL = 'https://mini-ecommerce-website-lrgz.vercel.app/api';
```

### 3. Run Development Server
```bash
pnpm run dev
```

### 4. Build for Production
To create an optimized production bundle:
```bash
pnpm run build
```
This builds the files into the `dist/` folder, ready for hosting services (e.g., Vercel, Netlify).

---

## 🔐 2-Step Login & Verification UI Flow
1. **Credentials Entry:** Enter your registered email and password.
2. **OTP Prompt:** If credentials match, the form transitions to an OTP screen with a 4-digit code mask.
3. **Delivery:** The backend triggers EmailJS to send the code to your email.
4. **Action Buttons:** You can request a "Resend OTP" or click "Back to credentials" if you made an error.
