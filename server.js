import cors from "cors";
import { OpenAI } from "openai";
import express from "express";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.port || 8000;
const app = express();
const __dirname = path.resolve();
console.log(__dirname);
// middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/build"));
app.get("/", (req, res) => {
  res.sendFile("/build/index.html");
});

app.post("/completions", async (req, res) => {
  const { prompt } = req.body;
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });
    const { message } = completion.choices[0];
    res.json({
      status: "success",
      message,
    });
  } catch (error) {
    const { message } = error;
    res.json({
      status: "error",
      message,
    });
  }
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
