# 🛍️ Mini E-Commerce Website — Backend API Server

This is the RESTful API server for the **Mini E-Commerce Website** developed using Node.js, Express, MongoDB (Mongoose), and JWT.

---

## ⚡ Tech Stack & Libraries
- **Runtime:** Node.js (v20+)
- **Server Framework:** Express.js
- **Database ORM:** Mongoose (MongoDB Atlas)
- **Token Security:** jsonwebtoken (JWT)
- **Cookie management:** cookie-parser
- **Encryption:** bcryptjs
- **Validation:** validator

---

## 📂 Project Structure

```bash
backend/
├── controller/          # Route handlers & controller logic
│   ├── authController.js    # Sign up, login, OTP sending/verification, profile
│   ├── cartController.js    # Add/update/remove/clear cart actions
│   ├── productController.js # Product creation and querying (general and vendor)
│   └── orderController.js   # Checkout log creation and vendor status adjustments
├── db/                  # Database connection setup
│   └── db.js
├── middleware/          # Security and request filters
│   └── authMiddleware.js    # Route protector mapping JWT to req.user
├── model/               # Mongoose schemas
│   ├── User.js              # Name, email, password hash, role, cart, OTP code/expiry
│   ├── Product.js           # Title, price, description, vendor ref, stock, image
│   └── Order.js             # Customer, product array, status, total cost
├── router/              # Express route mappings
│   ├── authRouter.js
│   ├── cartRouter.js
│   ├── productRouter.js
│   └── orderRouter.js
├── .env                 # Environment configurations (local only)
├── index.js             # Root server startup and setup
└── package.json
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
Ensure you are inside the `backend/` directory and run:
```bash
pnpm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the `backend/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_secret_jwt_key
SECRET_KEY=your_secret_jwt_key

# EmailJS Service Keys
EMAILJS_SERVICE_ID=service_j185gcr
EMAILJS_TEMPLATE_ID=template_bh6y4ah
EMAILJS_PUBLIC_KEY=55GjyR5HxwazD17Dl
EMAILJS_ACCESS_TOKEN=your_optional_emailjs_access_token
```

### 3. Run Server
Start the development server with hot-reloading (nodemon):
```bash
pnpm run dev
```

---

## 📧 EmailJS Server Integration Details
The server sends verification emails directly to users via a HTTP POST request to the EmailJS API (`https://api.emailjs.com/api/v1.0/email/send`). 

### Dynamic OTP Flow
1. **Password Match:** If email/password matches during `/api/auth/login`, an OTP generation routine triggers.
2. **OTP Generation:** A secure 4-digit code is created.
3. **Database Write:** The code is stored in the database under the User document alongside `otpExpires` (valid for 5 minutes).
4. **Email Delivery:** A request is dispatched to EmailJS with parameters `user_name`, `to_email`, `otp`, `email`, `user_email`, and `to`.
5. **Security Check:** If the account has Strict Mode toggled in the EmailJS dashboard, the server dynamically appends the private `accessToken`.
