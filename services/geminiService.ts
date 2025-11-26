import { GoogleGenAI } from "@google/genai";
import { UserSelections, StyleCategory } from "../types";

const getSystemPrompt = (selections: UserSelections): string => {
  const hairStyle = selections[StyleCategory.HAIR];
  const hairColor = selections[StyleCategory.HAIR_COLOR];
  const hairLength = selections[StyleCategory.HAIR_LENGTH];
  
  // Construct Hair Prompt
  let hairPromptParts = [];
  if (hairColor) hairPromptParts.push(`${hairColor} colored`);
  if (hairLength) hairPromptParts.push(hairLength);
  if (hairStyle) hairPromptParts.push(hairStyle);
  
  let hairPrompt = "Keep original hair";
  if (hairPromptParts.length > 0) {
    hairPrompt = hairPromptParts.join(" ");
  }

  const accessories = selections[StyleCategory.ACCESSORIES].length > 0 
    ? selections[StyleCategory.ACCESSORIES].join(", ") 
    : "Keep original accessories";
  const makeup = selections[StyleCategory.MAKEUP] || "Keep original complexion";
  const eyes = selections[StyleCategory.EYES] || "Keep original eyes";
  const lips = selections[StyleCategory.LIPS] || "Keep original lip color";
  const expression = selections[StyleCategory.EXPRESSION] || "Keep original facial expression";

  return `
    You are an expert photo editor and stylist.
    The user has provided an image of a person.
    
    TASK:
    Generate a photorealistic version of this person with the following specific style changes applied.
    
    CRITICAL CONSTRAINTS:
    1. PRESERVE IDENTITY: You must retain the original person's core identity, skin tone, unique features (like moles or specific nose shape), pose, lighting, and background.
    2. EXPRESSION & STRUCTURE: The user has selected the expression: "${expression}". 
       - You MUST modify the facial geometry (mouth shape, jaw position, eye opening, cheek muscles) to realistically depict this emotion. 
       - For example: if "Yawning" or "Screaming", open the mouth and drop the jaw. If "Pout", push the lips forward. 
       - It is required to change the facial structure to fit the expression, but the person must remain recognizable.
    3. HAIR & STYLING:
       - Hair: ${hairPrompt}
       - Accessories: ${accessories} (Ensure glasses/hats fit the head shape and perspective correctly).
       - Makeup Base: ${makeup}
       - Eye Makeup: ${eyes}
       - Lip Makeup: ${lips}
    4. REALISM: The result must look like a real photograph. Skin texture should remain realistic.
    5. If a category says "Keep original", do not modify that aspect unless it conflicts with another requested change (e.g., a hat might cover original hair).
  `;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateStyledImage = async (
  imageBase64: string,
  selections: UserSelections,
  retryCount = 0
): Promise<string> => {
  const MAX_RETRIES = 2;
  
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Clean base64 string (remove data URL prefix if present)
  const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

  try {
    const prompt = getSystemPrompt(selections);
    console.log("Attempt", retryCount + 1, "- Sending request to Gemini...");
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          }
        ]
      },
      config: {
        responseModalities: ['image', 'text'],
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      // Check if the response was blocked
      const blockReason = response.promptFeedback?.blockReason;
      if (blockReason) {
        throw new Error(`Request blocked: ${blockReason}. Try a different photo.`);
      }
      throw new Error("No response from AI. Please try again.");
    }

    const candidate = candidates[0];
    
    // Log finish reason for debugging
    console.log("Finish reason:", candidate.finishReason);
    console.log("Safety ratings:", candidate.safetyRatings);
    
    // Check for content filtering
    if (candidate.finishReason === 'SAFETY') {
      const safetyInfo = candidate.safetyRatings?.map(r => `${r.category}: ${r.probability}`).join(', ');
      throw new Error(`Image was filtered for safety (${safetyInfo || 'unknown reason'}). Try a different photo.`);
    }
    
    if (candidate.finishReason === 'RECITATION') {
      throw new Error("Request could not be completed. Please try again.");
    }

    if (candidate.finishReason === 'OTHER' || candidate.finishReason === 'BLOCKLIST') {
      throw new Error("Request was blocked. Try a different photo or simpler style options.");
    }

    // Safely access content and parts
    const content = candidate.content;
    if (!content || !content.parts) {
      // More detailed error logging
      console.log("Full candidate object:", JSON.stringify(candidate, null, 2));
      
      // Check if there's a specific reason
      if (candidate.finishReason === 'MAX_TOKENS') {
        throw new Error("Response was too large. Try fewer style options.");
      }
      
      throw new Error("AI couldn't generate this transformation. Try: 1) A clearer front-facing photo, 2) Fewer style changes, or 3) Different options.");
    }

    const parts = content.parts;
    let generatedImageBase64 = '';

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedImageBase64 = part.inlineData.data;
        break; 
      }
    }

    if (!generatedImageBase64) {
      // Check if there's a text response explaining why
      const textPart = parts.find(p => p.text);
      if (textPart?.text) {
        console.log("AI text response:", textPart.text);
      }
      throw new Error("Model couldn't generate an image. Try a clearer photo or different options.");
    }

    return `data:image/jpeg;base64,${generatedImageBase64}`;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Retry on transient errors
    const isRetryable = 
      error.message?.includes("empty response") ||
      error.message?.includes("couldn't generate") ||
      error.message?.includes("503") ||
      error.message?.includes("429") ||
      error.message?.includes("RESOURCE_EXHAUSTED");
    
    if (isRetryable && retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${(retryCount + 1) * 1000}ms...`);
      await delay((retryCount + 1) * 1000);
      return generateStyledImage(imageBase64, selections, retryCount + 1);
    }
    
    throw error;
  }
};