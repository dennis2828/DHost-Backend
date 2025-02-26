import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

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

app.get("/test", async (req: Request, res: Response) => {
  try{

    res.json({ message: "Welcome to the Express + TypeScript backend!" });
    const response = await axios.post(
      `https://discord.com/api/v10/channels/724220064223592541/messages`,
      {
        content: "Hello, World!",
        tts: false,
        embeds: [
          {
            title: "Hello, Embed!",
            description: "This is an embedded message."
          }
        ]
      },
      {
        headers: {
          Authorization: `re`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log(response);
    
  }catch(err){
    console.log(err);
    
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on ports ${PORT}`);
});
