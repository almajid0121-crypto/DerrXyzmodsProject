import { GoogleGenAI } from "@google/genai";

// Kunci API diambil secara aman dari Environment Variables.
const apiKey = process.env.GEMINI_API_KEY; 

if (!apiKey) {
    // Jika Kunci API belum diatur (di Vercel/Netlify)
    console.error("Kesalahan Konfigurasi: GEMINI_API_KEY belum diatur.");

    export default function handler(req, res) {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }
        return res.status(500).json({ error: 'Kesalahan Server: Kunci API Gemini belum diatur di Environment Variables.' });
    }
} else {
    const ai = new GoogleGenAI(apiKey);

    export default async function handler(req, res) {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        try {
            const { message } = req.body;

            if (!message) {
                return res.status(400).json({ error: 'Pesan kosong.' });
            }

            // Persona AI Anda
            const systemInstruction = `Anda adalah 'Ultimate Cyber-Neon AI' dari DerrXyzMods. Anda cerdas, ramah, dan berfokus pada cyber security dan web development. Berikan jawaban yang singkat, antusias, dan relevan dengan profil DerrXyzMods.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: message }] }],
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7, 
                },
            });

            const aiText = response.text.trim();
            res.status(200).json({ response: aiText });

        } catch (error) {
            console.error("Kesalahan API:", error);
            res.status(500).json({ error: 'Kesalahan internal server saat menghubungi Gemini API.' });
        }
    }
}
