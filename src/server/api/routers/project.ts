import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import pollCommits from "@/utils/github.utils";
import { createProjectValidationSchema } from "@/utils/project.utils";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  createProject: privateProcedure
    .input(createProjectValidationSchema)
    .mutation(async ({ ctx, input }) => {
      const projects = await ctx.db.project.create({
        data: {
          name: input.name,
          githubUrl: input?.githubUrl ?? "",
          userToProjects: {
            create: {
              userId: ctx.user.userId!,
            },
          },
        },
      });

      //* Auto Poll Commits
      await pollCommits(projects?.id);
      return projects;
    }),
  getProjects: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.project.findMany({
      where: {
        userToProjects: {
          some: {
            userId: ctx.user.userId!,
          },
        },
        deletedAt: null, // Only return projects that are not deleted
      },
    });
  }),
  getCommits: privateProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      //* Auto Poll Commits for newer commits
      await pollCommits(input?.projectId).then().catch(console.error);

      return await ctx.db.commit.findMany({
        where: {
          projectId: input?.projectId,
        },
      });
    }),
});
