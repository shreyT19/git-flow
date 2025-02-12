"use server";

import { db } from "@/server/db";
import type {
  ICreateSourceCodeEmbedding,
  ISourceCodeEmbeddingBase,
} from "@/types/sourceCodeEmbedding.types";

/**
 *  Adds a new source code embedding to the database.
 * @param data
 * @returns
 */
export const addSourceCodeEmbedding = async (
  data: ICreateSourceCodeEmbedding,
) => {
  const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
    data: {
      summary: data.summary,
      fileName: data?.fileName,
      projectId: data?.projectId,
      sourceCode: data?.sourceCode,
    },
  });
  //! Prisma does not support inserting vectors yet
  //* Current Workaround : Writing a raw SQL query to insert the vector into the database
  await db.$executeRaw`
  UPDATE "SourceCodeEmbedding"
  SET "summaryEmbedding" = ${data.summaryEmbedding}::vector
  WHERE id = ${sourceCodeEmbedding.id}
  `;
  return sourceCodeEmbedding;
};

export const getSimilarSourceCodeEmbeddingsFromVector = async (
  vector: string,
  projectId: string,
): Promise<ISourceCodeEmbeddingBase[]> => {
  // CosineSimilarity - is a measure of similarity between two non-zero vectors of an inner product space
  return await db.$queryRaw`
  SELECT *,
  1 - ("summaryEmbedding" <=> ${vector}::vector) AS cosineSimilarity 
  FROM "SourceCodeEmbedding"
  WHERE 1 - ("summaryEmbedding" <=> ${vector}::vector) > 0.5
  AND "projectId" = ${projectId}
  ORDER BY cosineSimilarity DESC
  LIMIT 10
  `;
};
