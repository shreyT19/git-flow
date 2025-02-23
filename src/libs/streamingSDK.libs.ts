"use server";

import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbeddingsUsingLLM } from "./llmSdk.libs";
import { getSimilarSourceCodeEmbeddingsFromVector } from "@/actions/source-code-embedding/repository";
import { ASK_QUESTION_PROMPT } from "@/constants/prompts";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export const askQuestion = async (question: string, projectId: string) => {
  const stream = createStreamableValue();

  // Generates embeddings for the question using the LLM
  const queryVector = await generateEmbeddingsUsingLLM(question);

  const vectorQuery = `[${queryVector.join(",")}]`;

  // Gets similar source code embeddings from the database
  const result = await getSimilarSourceCodeEmbeddingsFromVector(
    vectorQuery,
    projectId,
  );

  let context = "";

  for (const doc of result) {
    context += `source: ${doc?.fileName}\n code content: ${doc?.sourceCode}\n summary of the file: ${doc?.summary}\n\n`;
  }

  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-1.5-flash"),
      prompt: ASK_QUESTION_PROMPT(context, question),
    });

    for await (const chunk of textStream) {
      stream.update(chunk);
    }

    stream.done();
  })();

  return {
    stream: stream.value,
    fileReferences: result,
  };
};
