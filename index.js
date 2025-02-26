"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const busboy_1 = __importDefault(require("busboy"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Express + TypeScript backend!" });
});
app.post("/upload", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bb = (0, busboy_1.default)({ headers: req.headers });
    bb.on("file", (_, file, info) => {
        const { filename, mimeType } = info;
        const tempFilePath = path_1.default.join(__dirname, filename);
        // Save file temporarily
        const stream = fs_1.default.createWriteStream(tempFilePath);
        file.pipe(stream);
        stream.on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Prepare FormData for Discord
                const formData = new form_data_1.default();
                formData.append("file", fs_1.default.createReadStream(tempFilePath), { filename });
                formData.append("payload_json", JSON.stringify({ content: "Here's an image!" }));
                // Send to Discord
                const discordResponse = yield axios_1.default.post(`https://discord.com/api/v10/channels/${process.env.DISCORD_CHANNEL_ID}/messages`, formData, {
                    headers: Object.assign({ Authorization: `${process.env.BOT_TOKEN}` }, formData.getHeaders()),
                });
                // Cleanup temp file
                fs_1.default.unlinkSync(tempFilePath);
                res.json({ message: "File uploaded and sent to Discord", discordResponse: discordResponse.data });
            }
            catch (error) {
                console.error("Error uploading to Discord:", error);
                res.status(500).json({ error: "Failed to upload image" });
            }
        }));
    });
    req.pipe(bb);
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
