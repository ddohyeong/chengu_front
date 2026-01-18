
import { GoogleGenAI, Type } from "@google/genai";
import { Item, SalesListing, ReceiptItem } from '../types';

// Helper to initialize the client safely right before making a call
const getClient = () => {
  // Use process.env.API_KEY directly as a named parameter as per guidelines
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateSalesListing = async (item: Item): Promise<SalesListing> => {
  const ai = getClient();
  
  // Using gemini-3-flash-preview for quick text generation as per guidelines for Basic Text Tasks
  const modelId = "gemini-3-flash-preview";

  const subCategoryInfo = item.subCategory ? `(Sub-category: ${item.subCategory})` : '';

  const prompt = `
    I want to sell a used item on a Korean marketplace (like Karrot Market/Danggeun).
    Please generate a catchy title, a polite and detailed description, estimated price range (in KRW), and hashtags.
    
    Item Details:
    - Name: ${item.name}
    - Category: ${item.category} ${subCategoryInfo}
    - Purchase Date: ${item.purchaseDate}
    - Note/Condition: ${item.note || 'Used in good condition'}
    
    Output JSON format.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Catchy sales title in Korean" },
          description: { type: Type.STRING, description: "Detailed sales body text in Korean" },
          suggestedPriceRange: { type: Type.STRING, description: "Estimated price range e.g., '10,000원 ~ 15,000원'" },
          hashtags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Relevant Korean hashtags" 
          }
        },
        required: ["title", "description", "suggestedPriceRange", "hashtags"],
        propertyOrdering: ["title", "description", "suggestedPriceRange", "hashtags"]
      }
    }
  });

  // Access the .text property directly (not a method call) as per guidelines
  const text = response.text;
  if (!text) throw new Error("No response from Gemini");

  return JSON.parse(text) as SalesListing;
};

export const analyzeReceipt = async (base64Image: string): Promise<{ items: ReceiptItem[], purchaseDate: string }> => {
  const ai = getClient();
  // Using gemini-3-flash-preview for multimodal tasks
  const modelId = "gemini-3-flash-preview";

  const prompt = `
    Analyze this receipt image. 
    1. Extract the purchase date (YYYY-MM-DD format). If not found, use today's date.
    2. Extract the list of purchased items.
    3. For each item, map it to one of these main categories: 'food', 'electronics', 'clothes', 'furniture', 'misc'.
    4. Also try to infer a specific sub-category name in Korean (e.g. '우유', '과자', '셔츠').
    
    Return JSON.
  `;

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: "image/jpeg",
    },
  };

  const response = await ai.models.generateContent({
    model: modelId,
    contents: {
      parts: [imagePart, { text: prompt }]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          purchaseDate: { type: Type.STRING, description: "YYYY-MM-DD" },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING, description: "One of: food, electronics, clothes, furniture, misc" },
                subCategory: { type: Type.STRING, description: "Inferred sub category in Korean" }
              },
              required: ["name", "category", "subCategory"],
              propertyOrdering: ["name", "category", "subCategory"]
            }
          }
        },
        required: ["purchaseDate", "items"],
        propertyOrdering: ["purchaseDate", "items"]
      }
    }
  });

  // Access the .text property directly (not a method call) as per guidelines
  const text = response.text;
  if (!text) throw new Error("Failed to analyze receipt");

  return JSON.parse(text);
};
