import { GoogleGenAI } from "@google/genai";
import type { FinancialProduct } from '@gigsafehub/types';

const getClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in process.env.NEXT_PUBLIC_GEMINI_API_KEY");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeComparison = async (products: FinancialProduct[]): Promise<string> => {
  const client = getClient();
  if (!client) return "API Key missing. Cannot generate AI comparison.";

  const productDescriptions = products.map(p =>
    `Name: ${p.name}, Category: ${p.category}, Rating: ${p.rating}, Fees: ${p.fees}, SafetyScore: ${p.safetyScore}, Pros: ${p.pros.join(', ')}, Cons: ${p.cons.join(', ')}`
  ).join('\n\n');

  const prompt = `
    Analyze the following financial products for a gig economy worker.
    Compare them based on fees, safety, and suitability for freelancers.
    Provide a concise recommendation on which one is best for what type of user.

    Products:
    ${productDescriptions}
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error communicating with AI service.";
  }
};

export const getSmartSummary = async (product: FinancialProduct): Promise<string> => {
    const client = getClient();
    if (!client) return "API Key missing.";

    const prompt = `
      Write a short, punchy 2-sentence summary hook for this financial product targeting a freelancer:
      ${JSON.stringify(product)}
    `;

    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || "";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Could not generate summary.";
    }
  };

