import cors from "cors";
import { OpenAI } from "openai";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8000;
const app = express();
// middleware
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Server is up and running",
  });
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
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
