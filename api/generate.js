import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not set' });
    }

    try {
        const { prompt } = req.body || {};

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        
        // This process.env.GEMINI_API_KEY will be set in the Vercel Dashboard
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return res.status(200).json({ text });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to generate content." });
    }
}