import type { IDocument } from "@/types/langchain.types";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { generateEmbeddingsUsingLLM, summarizeCodeUsingLLM } from "./ai.utils";
import { addSourceCodeEmbedding } from "@/actions/source-code-embedding/repository";

const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken ?? "",
    branch: "main",
    ignoreFiles: [
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
    ],
    recursive: true,
    maxConcurrency: 7,
    unknown: "warn", // warns for unknown files e.g pdf, jpg, etc
  });
  const docs = await loader.load();
  return docs;
};

const generateEmbeddings = async (docs: IDocument[]) => {
  return await Promise.all(
    docs.map(async (doc) => {
      //* Summarize code using LLM
      const summary = await summarizeCodeUsingLLM(doc);
      //* Generate embeddings using LLM
      const embeddings = await generateEmbeddingsUsingLLM(summary);
      return {
        summary,
        embeddings,
        sourceCode: JSON.parse(JSON.stringify(doc?.pageContent)),
        fileName: doc?.metadata?.source,
      };
    }),
  );
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  //* Load Github Repo using Langchain
  const docs = await loadGithubRepo(githubUrl, githubToken);
  //* Generate embeddings for each file
  const allEmbeddings = await generateEmbeddings(docs);

  await Promise.allSettled(
    allEmbeddings?.map(async (embedding, index) => {
      console.log(`Processing ${index} of ${allEmbeddings?.length}s`);
      if (!embedding) return;
      const { summary, embeddings, sourceCode, fileName } = embedding;
      //* Store embeddings in Prisma
      await addSourceCodeEmbedding({
        projectId,
        summary,
        summaryEmbedding: embeddings,
        sourceCode,
        fileName,
      });
    }),
  );

  return;
};
