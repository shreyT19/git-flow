"use server";

import { db } from "@/server/db";
import type { ICreateSourceCodeEmbedding } from "@/types/sourceCodeEmbedding.types";

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
