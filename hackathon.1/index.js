import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to OpenAI using your API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Example endpoint to generate code
app.post("/generate-code", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    res.send(response.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

// ✅ Export for Vercel
export default app;