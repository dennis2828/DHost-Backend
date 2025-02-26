import axios from "axios";
import FormData from "form-data";
import busboy from "busboy";
import stream from "stream";


const upload = async (req: Request, res: Response) =>{
  //@ts-ignore
  const bb = busboy({ headers: req.headers });

  bb.on("file", async (_, file, info) => {
    const { filename, mimeType } = info;
    const passThrough = new stream.PassThrough(); // Stream data in memory

    // Pipe file data directly into the FormData stream
    const formData = new FormData();
    formData.append("file", passThrough, { filename, contentType: mimeType });
    formData.append("payload_json", JSON.stringify({ content: "Here's an image!" }));

    // Stream file data directly into FormData
    file.pipe(passThrough);

    // Send to Discord
    try{
      const response = await axios
      .post(`https://discord.com/api/v10/channels/${process.env.DISCORD_CHANNEL_ID}/messages`, formData, {
        headers: {
          Authorization: `${process.env.BOT_TOKEN}`,
          ...formData.getHeaders(),
        },
      });
      const discordImageId = response.data.id;
      const url = await generateUploadLink(process.env.DISCORD_CHANNEL_ID as string,discordImageId);

      //@ts-ignore
      res.json({ message: "File uploaded and sent to Discord", discordResponse: url });
      
    }catch(err){
      console.error("Server error uploading to Discord:", err);
      //@ts-ignore
      res.status(500).json({ error: "Failed to upload image" });
    }
    
  });
  //@ts-ignore
  req.pipe(bb);
}


async function generateUploadLink(channelId: string, messageId: string): Promise<string>{
  try{
    const response = await axios
    .get(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`,{
      headers: {
        Authorization: `${process.env.BOT_TOKEN}`,
      },
    });
    return response.data.attachments[0].url || "";
    
  }catch(err){
    console.log("Server error: ",err);
    
    return "";
  }
}

module.exports = {upload};