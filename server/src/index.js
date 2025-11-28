import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectMongo } from './lib/mongo.js';

import authRoutes from './routes/auth.routes.js';
import orderRoutes from './routes/order.routes.js';
import contactRoutes from './routes/contact.routes.js';
import otpRoutes from './routes/otp.routes.js';

const app = express();

/* -------------------------------------------------------
   CORS CONFIG (FULLY FIXED FOR RENDER + PREFLIGHT)
-------------------------------------------------------- */
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',')
  : [
      "https://herb-and-veda-1.onrender.com",
      "http://localhost:3000"
    ];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

/* ------------------------------------------------------ */

app.use(express.json());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.json({ ok: true, name: "Herb & Veda Ayurvedic Company API" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;

// MongoDB + Server start
connectMongo()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`API running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
