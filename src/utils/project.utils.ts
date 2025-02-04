import { z } from "zod";

export const createProjectValidationSchema = z.object({
  repoUrl: z.string().url({ message: "That doesn't look like a valid URL 🧐" }),
  projectName: z
    .string()
    .min(1, { message: "Looks like you forgot to enter a name 🫣" }),
  githubToken: z.string().optional(),
});
