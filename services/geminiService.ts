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
  const facialHair = selections[StyleCategory.FACIAL_HAIR] || "Keep original facial hair";

  return `
    CONTEXT: You are a professional digital beauty and fashion stylist tool used by the person in this photo to preview different looks on themselves. This is a consensual self-styling application similar to virtual try-on tools used by beauty brands.
    
    IMAGE ACCEPTANCE: Accept ANY photo where a person's face is visible, regardless of what else is in the image. The photo may include:
    - Full body shots, half body, or close-ups
    - Multiple people (focus on the main/central person)
    - Any background (indoor, outdoor, studio, casual)
    - Any pose or angle - front-facing, profile, three-quarter view, looking over shoulder, etc.
    - The person wearing any clothing or accessories
    
    As long as you can see facial features on at least one person, proceed with the styling. Do NOT refuse images just because they show more than a face.
    
    TASK: Apply the requested styling changes to the person in this photo. Keep the overall image similar but with the new look applied. This is for personal use by the individual pictured.
    
    IMPORTANT: You MUST attempt to generate an image. Do not refuse unless the image contains absolutely no visible human face. Even challenging images should be attempted.
    
    STYLING SPECIFICATIONS:
    - Hairstyle: ${hairPrompt}
    - Facial Hair: ${facialHair}
    - Cosmetics (base): ${makeup}
    - Eye cosmetics: ${eyes}  
    - Lip cosmetics: ${lips}
    - Accessories/props: ${accessories}
    - Expression: ${expression}
    
    COMPOSITION GUIDANCE (KEEP OVERALL LOOK SIMILAR):
    1. Try to keep the overall framing, camera angle, and background feel similar to the input photo.
    2. Minor adjustments to background, crop, or lighting are allowed if needed to realistically show the requested style changes.
    3. Do NOT completely change the scene or setting; this should still feel like the same photo session of the same person.
    
    CRITICAL IDENTITY RULES (DO NOT VIOLATE):
    1. FACE STRUCTURE IS SACRED: Never alter the person's bone structure, face shape, jaw line, nose shape, eye shape, eye spacing, forehead size, chin shape, or cheekbone structure. These define WHO the person is.
    2. PRESERVE DISTINGUISHING FEATURES: Keep all moles, birthmarks, freckles, dimples, scars, and unique facial characteristics exactly as they appear.
    3. SKIN & TONE: Maintain the exact same skin tone, undertone, and complexion. Cosmetics sit ON TOP of skin, they don't change the skin itself.
    4. THE PERSON MUST BE IMMEDIATELY RECOGNIZABLE: If you showed the output to someone who knows this person, they should instantly recognize them.
    
    WHAT YOU CAN CHANGE (and ONLY these things):
    - Hair (style, color, length) - this is external to the face
    - Cosmetics/makeup - applied ON the existing features, not reshaping them
    - Accessories - glasses, jewelry, hats, etc.
    - Facial hair - beards, mustaches, etc.
    - Expression - ONLY through natural muscle movement (smiling, frowning, etc.), NOT by changing the underlying face shape.
    
    EXPRESSION NOTE: Expressions change muscle position (mouth opens, eyes squint, brows raise) but the face STRUCTURE stays identical. A smile doesn't change someone's jaw bone - it moves their muscles.
    
    PHOTOREALISM: Output should match professional portrait photography quality with natural skin texture and lighting consistent with the original.
    
    Generate the styled portrait now, keeping the person clearly recognizable and the overall photo feeling similar, while applying the requested styling changes.
  `;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-flash-image', label: 'Nano Banana' },
  { id: 'gemini-3-pro-image-preview', label: 'Nano Banana Pro' },
] as const;

export type GeminiModelId = typeof AVAILABLE_MODELS[number]['id'];

export const DEFAULT_MODEL: GeminiModelId = 'gemini-2.5-flash-image';

export const generateStyledImage = async (
  imageBase64: string,
  selections: UserSelections,
  retryCount = 0,
  model: GeminiModelId = DEFAULT_MODEL
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
    console.log("Attempt", retryCount + 1, `- Sending request to ${model}...`);
    
    const response = await ai.models.generateContent({
      model,
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
    console.log("Safety ratings:", JSON.stringify(candidate.safetyRatings, null, 2));
    console.log("Full response structure:", JSON.stringify(response, null, 2).slice(0, 2000));
    
    // Check for content filtering
    if (candidate.finishReason === 'SAFETY') {
      const safetyInfo = candidate.safetyRatings?.map(r => `${r.category}: ${r.probability}`).join(', ');
      console.log("Safety block details:", safetyInfo);
      throw new Error(`Image was filtered by safety system. This may happen with certain poses or clothing. Try a more standard portrait-style photo.`);
    }
    
    if (candidate.finishReason === 'RECITATION') {
      throw new Error("Request could not be completed. Please try again.");
    }

    if (candidate.finishReason === 'OTHER' || candidate.finishReason === 'BLOCKLIST') {
      console.log("Blocked with finishReason:", candidate.finishReason);
      throw new Error("The AI couldn't process this image. This sometimes happens with non-standard poses. Try a front-facing or simple portrait photo.");
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
        console.log("AI text response (no image generated):", textPart.text);
        // Pass along the AI's explanation if it's helpful
        if (textPart.text.toLowerCase().includes('cannot') || textPart.text.toLowerCase().includes('sorry')) {
          throw new Error(`AI declined: ${textPart.text.slice(0, 150)}`);
        }
      }
      throw new Error("No image was generated. The AI may have had difficulty with the pose or angle. Try a different photo.");
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
      return generateStyledImage(imageBase64, selections, retryCount + 1, model);
    }
    
    throw error;
  }
};