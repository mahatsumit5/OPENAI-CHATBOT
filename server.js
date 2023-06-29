import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import express from "express";
import * as dotenv from "dotenv";
dotenv.config();

const PORT = process.env.port || 8000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(201).json({
    status: "sucess",
    mesage: "Server is up and running",
  });
});

app.post("/completions", async (req, res) => {
  const { questions } = req.body;
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "system", content: questions },
      ],
    });
    const { message } = completion.data.choices[0];
    res.send({
      status: "success",
      message,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      error,
    });
  }
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
