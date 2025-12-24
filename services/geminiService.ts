
import { GoogleGenAI, Type } from "@google/genai";

export const getAITaskBreakdown = async (taskTitle: string): Promise<string[]> => {
  // Initialize the client using process.env.API_KEY directly as per SDK requirements.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Break down the task "${taskTitle}" into 4-6 small, actionable sub-steps. Provide only the list of sub-steps as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    // Access the .text property directly (not as a method) and parse the JSON string.
    const jsonStr = (response.text || '').trim();
    return jsonStr ? JSON.parse(jsonStr) : [];
  } catch (error) {
    console.error("Gemini breakdown error:", error);
    return [];
  }
};
