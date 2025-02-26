import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import FormData from "form-data";
import busboy from "busboy";
import fs from "fs";
import path from "path";


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

app.post("/upload", async (req, res) => {
  const bb = busboy({ headers: req.headers });

  bb.on("file", (_, file, info) => {
    const { filename, mimeType } = info;
    const tempFilePath = path.join(__dirname, filename);

    // Save file temporarily
    const stream = fs.createWriteStream(tempFilePath);
    file.pipe(stream);

    stream.on("finish", async () => {
      try {
        // Prepare FormData for Discord
        const formData = new FormData();
        formData.append("file", fs.createReadStream(tempFilePath), { filename });
        formData.append("payload_json", JSON.stringify({ content: "Here's an image!" }));

        // Send to Discord
        const discordResponse = await axios.post(
          `https://discord.com/api/v10/channels/${process.env.DISCORD_CHANNEL_ID}/messages`,
          formData,
          {
            headers: {
              Authorization: `${process.env.BOT_TOKEN}`,
              ...formData.getHeaders(),
            },
          }
        );

        // Cleanup temp file
        fs.unlinkSync(tempFilePath);

        res.json({ message: "File uploaded and sent to Discord", discordResponse: discordResponse.data });
      } catch (error) {
        console.error("Error uploading to Discord:", error);
        res.status(500).json({ error: "Failed to upload image" });
      }
    });
  });

  req.pipe(bb);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
