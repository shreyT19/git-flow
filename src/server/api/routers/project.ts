import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { createProjectValidationSchema } from "@/utils/project.utils";

export const projectRouter = createTRPCRouter({
  createProject: privateProcedure
    .input(createProjectValidationSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.project.create({
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
    }),
});
