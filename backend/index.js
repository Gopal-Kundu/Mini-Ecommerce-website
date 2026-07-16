import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import authRouter from './router/authRouter.js';
import productRouter from './router/productRouter.js';
import cartRouter from './router/cartRouter.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


connectDB();


app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);



app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
