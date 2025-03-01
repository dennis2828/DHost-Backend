import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

const uploadRouter = require("./routes/upload");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "https://dhost-beige.vercel.app", // ✅ Allow requests only from your frontend
  methods: ["GET", "POST"],  // ✅ Define allowed methods
  allowedHeaders: ["Content-Type", "Authorization"] // ✅ Define allowed headers
}));
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript backend!" });
});

app.post("/upload", uploadRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
