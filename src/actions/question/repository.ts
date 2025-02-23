"use server";

import { db } from "@/server/db";
import { IQuestionBase } from "@/utils/question.utils";

/**
 * Save a question and answer to the database
 * @param userId - The user's ID
 * @param question - The question and answer to save
 * @returns The created question
 */
export const saveAnswer = async (userId: string, question: IQuestionBase) => {
  return await db.question.create({
    data: {
      userId,
      projectId: question?.projectId,
      question: question?.question,
      answer: question?.answer,
      fileReferences: question?.fileReferences as any,
    },
  });
};
