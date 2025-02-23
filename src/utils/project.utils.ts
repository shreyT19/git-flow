import { z } from "zod";

export const createProjectValidationSchema = z
  .object({
    githubUrl: z.string().optional(),
    name: z
      .string()
      .min(1, { message: "Looks like you forgot to enter a name 🫣" }),
    githubToken: z.string().optional(),
  })

  .refine((data) => data?.githubUrl || data?.githubToken, {
    message: "Either GitHub URL or GitHub Token is required 🧐",
    path: ["githubUrl"],
  })
  .refine((data) => !(data.githubUrl && data.githubToken), {
    message: "Provide either GitHub URL or GitHub Token, not both 🫣",
    path: ["githubUrl"],
  });

export type IProject = z.infer<typeof createProjectValidationSchema>;

export const getProjectIdSchema = z.object({
  projectId: z.string(),
});
