import express from "express"; // to create backend server
import OpenAI from "openai/index.mjs";   // to connect AI
import dotenv from "dotenv";    // to read your API key
import cors from "cors";        // allow frontend to talk to backend

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to OpenAI using your API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Example endpoint to generate code
app.post("/generate-code", async (req, res) => {
  const { prompt } = req.body; // get prompt from frontend
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",   // GPT model
    messages: [{ role: "user", content: prompt }],
  });
  res.send(response.choices[0].message.content); // send AI result back
});

// Start the server
app.listen(3001, () => console.log("Backend running on port 3001"));