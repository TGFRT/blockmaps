import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const MODEL_NAME = "gemini-2.5-flash";

export async function POST(request: Request) {
    try {
        const { prompt, location } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const tools: any[] = [{ googleMaps: {} }];

        let toolConfig: any = undefined;
        if (location && location.latitude && location.longitude) {
            toolConfig = {
                retrievalConfig: {
                    latLng: {
                        latitude: location.latitude,
                        longitude: location.longitude,
                    },
                },
            };
        }

        // Correct syntax for v1.x.x SDK
        const response = await genAI.models.generateContent({
            model: MODEL_NAME,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                tools: tools,
                toolConfig: toolConfig
            }
        });

        const candidate = response.candidates?.[0];
        const text = candidate?.content?.parts?.map(p => p.text).join('') || "No information found.";
        const groundingMetadata = candidate?.groundingMetadata;

        return NextResponse.json({
            text,
            groundingMetadata,
        });

    } catch (error: any) {
        console.error("Error in search API:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
