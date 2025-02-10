import type { IDocument } from "@/types/langchain.types";
import {
  COMMIT_MESSAGE_PROMPT,
  SUMMARIZE_CODE_PROMPT,
} from "@/constants/prompts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const generativeLLMModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
const embeddingLLMModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});

export const generateCommitSummaryUsingLLM = async (diff: string) => {
  const prompt = COMMIT_MESSAGE_PROMPT(diff);
  const response = await generativeLLMModel.generateContent(prompt);
  return response.response.text();
};

export const summarizeCodeUsingLLM = async (doc: IDocument) => {
  const code = doc?.pageContent?.slice(0, 10000); // limit to 10k characters to avoid token limit
  const prompt = SUMMARIZE_CODE_PROMPT(doc?.metadata?.source, code);
  const response = await generativeLLMModel.generateContent(prompt);
  return response.response.text();
};

export const generateEmbeddingsUsingLLM = async (summary: string) => {
  const response = await embeddingLLMModel.embedContent(summary);
  const embeddings = response.embedding;
  return embeddings.values;
};
