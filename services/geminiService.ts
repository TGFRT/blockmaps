import { GoogleGenAI, Content, Part } from "@google/genai";
import { Message, LatLng } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-2.5-flash as required for Google Maps grounding
const MODEL_NAME = "gemini-2.5-flash";

export const sendMessageToGemini = async (
  history: Message[],
  currentMessage: string,
  userLocation: LatLng | null
) => {
  try {
    // 1. Construct the history in the format Gemini expects
    // We only send text parts for history to keep it simple and robust
    const contents: Content[] = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text } as Part],
    }));

    // 2. Add the current user message
    contents.push({
      role: "user",
      parts: [{ text: currentMessage } as Part],
    });

    // 3. Prepare config with Maps Grounding
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    // Add retrieval config if location is available
    if (userLocation) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: config,
    });

    const candidate = response.candidates?.[0];
    const text = candidate?.content?.parts?.map(p => p.text).join('') || "I found some information.";
    const groundingMetadata = candidate?.groundingMetadata;

    return {
      text,
      groundingMetadata,
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
