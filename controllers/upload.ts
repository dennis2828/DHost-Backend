import axios from "axios";
import FormData from "form-data";
import busboy from "busboy";
import fs from "fs";
import path from "path";


const upload = async (req: Request, res: Response) =>{
    //@ts-ignore
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
        //@ts-ignore
        res.json({ message: "File uploaded and sent to Discord", discordResponse: discordResponse.data });
      } catch (error) {
        console.error("Error uploading to Discord:", error);
        //@ts-ignore
        res.status(500).json({ error: "Failed to upload image" });
      }
    });
  });

  //@ts-ignore
  req.pipe(bb);

}

module.exports = {upload};