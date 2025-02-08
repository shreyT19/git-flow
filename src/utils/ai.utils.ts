import getPrompt from "@/constants/prompt";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateCommitSummaryFromAI = async (diff: string) => {
  const prompt = getPrompt(diff);
  const response = await model.generateContent(prompt);
  return response.response.text();
};
