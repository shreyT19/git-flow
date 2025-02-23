import { z } from "zod";

export const createQuestionValidationSchema = z.object({
  projectId: z.string(),
  question: z.string(),
  answer: z.string(),
  fileReferences: z.array(
    z.object({
      fileName: z.string(),
      sourceCode: z.string(),
      summary: z.string(),
    }),
  ),
});

export type IQuestionBase = z.infer<typeof createQuestionValidationSchema>;
