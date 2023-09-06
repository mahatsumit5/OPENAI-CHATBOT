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
  console.log("first");
  console.log(req.body);
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You will be provided with a block of text, and your task is to extract a list of keywords from it.",
        },
        {
          role: "user",
          content:
            "Black-on-black ware is a 20th- and 21st-century pottery tradition developed by the Puebloan Native American ceramic artists in Northern New Mexico. Traditional reduction-fired blackware has been made for centuries by pueblo artists. Black-on-black ware of the past century is produced with a smooth surface, with the designs applied through selective burnishing or the application of refractory slip. Another style involves carving or incising designs and selectively polishing the raised areas. For generations several families from Kha'po Owingeh and P'ohwhóge Owingeh pueblos have been making black-on-black ware with the techniques passed down from matriarch potters. Artists from other pueblos have also produced black-on-black ware. Several contemporary artists have created works honoring the pottery of their ancestors.",
        },
        {
          role: "assistant",
          content:
            "Black-on-black ware, pottery tradition, Puebloan Native American, ceramic artists, Northern New Mexico, reduction-fired blackware, pueblo artists, smooth surface, designs, selective burnishing, refractory slip, carving, incising designs, polishing, generations, families, Kha'po Owingeh, P'ohwhóge Owingeh, pueblos, techniques, matriarch potters, contemporary artists, ancestors.",
        },
      ],
    });
    const { message } = completion.choices[0];
    res.send({
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
