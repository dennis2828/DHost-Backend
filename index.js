"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const uploadRouter = require("./routes/upload");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: ["https://dhost-beige.vercel.app", "http://localhost:3000"], // ✅ Allow requests only from your frontend
    methods: ["GET", "POST"], // ✅ Define allowed methods
    allowedHeaders: ["Content-Type", "Authorization"] // ✅ Define allowed headers
}));
app.use(express_1.default.json());
// Routes
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Express + TypeScript backend!" });
});
app.post("/upload", uploadRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
