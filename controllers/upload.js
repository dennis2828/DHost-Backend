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
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const busboy_1 = __importDefault(require("busboy"));
const stream_1 = __importDefault(require("stream"));
const upload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const bb = (0, busboy_1.default)({ headers: req.headers });
    bb.on("file", (_, file, info) => __awaiter(void 0, void 0, void 0, function* () {
        const { filename, mimeType } = info;
        const passThrough = new stream_1.default.PassThrough(); // Stream data in memory
        // Pipe file data directly into the FormData stream
        const formData = new form_data_1.default();
        formData.append("file", passThrough, { filename, contentType: mimeType });
        formData.append("payload_json", JSON.stringify({ content: "Here's an image!" }));
        // Stream file data directly into FormData
        file.pipe(passThrough);
        // Send to Discord
        try {
            const response = yield axios_1.default
                .post(`https://discord.com/api/v10/channels/${process.env.DISCORD_CHANNEL_ID}/messages`, formData, {
                headers: Object.assign({ Authorization: `${process.env.BOT_TOKEN}` }, formData.getHeaders()),
            });
            const discordImageId = response.data.id;
            const url = yield generateUploadLink(process.env.DISCORD_CHANNEL_ID, discordImageId);
            //@ts-ignore
            res.json({ message: "File uploaded and sent to Discord", discordResponse: url });
        }
        catch (err) {
            console.error("Server error uploading to Discord:", err);
            //@ts-ignore
            res.status(500).json({ error: "Failed to upload image" });
        }
    }));
    //@ts-ignore
    req.pipe(bb);
});
function generateUploadLink(channelId, messageId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default
                .get(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
                headers: {
                    Authorization: `${process.env.BOT_TOKEN}`,
                },
            });
            return response.data.attachments[0].url || "";
        }
        catch (err) {
            console.log("Server error: ", err);
            return "";
        }
    });
}
module.exports = { upload };
