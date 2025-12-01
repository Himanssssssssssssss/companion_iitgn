import { GoogleGenAI } from "@google/genai";

// NOTE: In a production environment, never expose keys on the client side.
// This is for demonstration as requested by the prompt structure.
// The key is expected to be in process.env.API_KEY
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const analyzeImage = async (base64Image: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure process.env.API_KEY.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Analyze this image. 
      1. If it contains text (like a document, notice, or poster), extract the text content accurately. 
      2. If it is a poster for an event, identify the 'Title', 'Date', 'Time', and 'Venue'.
      3. Format the output clearly with headings.
      4. If no text is found, describe the image briefly.
    `;

    // Remove the data URL prefix if present (e.g., "data:image/jpeg;base64,")
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    return response.text || "No result generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to analyze image. Please try again.";
  }
};
