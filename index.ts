import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

const uploadRouter = require("./routes/upload");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Express + TypeScript backend!" });
});

app.post("/upload", uploadRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
