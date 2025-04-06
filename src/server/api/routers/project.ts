import { getCommitsByProjectId } from "@/actions/commit/repository";
import {
  archiveProject,
  createProject,
  getArchivedProjectsByUserId,
  getProjectById,
  getProjectsByUserId,
  unarchiveProject,
} from "@/actions/project/repository";
import {
  saveAnswer,
  getQuestionsByProjectId,
  getQuestionsByUserId,
  getQuestionsByProjectIdAndUserId,
} from "@/actions/question/repository";
import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";
import { indexGithubRepo } from "@/libs/langchain.libs";
import pollCommits from "@/libs/githubOctokit.libs";
import {
  getProjectIdSchema,
  createProjectValidationSchema,
} from "@/utils/project.utils";
import { createQuestionValidationSchema } from "@/utils/question.utils";
import {
  createMeetingValidationSchema,
  getMeetingIdSchema,
} from "@/utils/meeting.utils";
import {
  deleteMeeting,
  getMeetingById,
  getMeetingsByProjectId,
  getMeetingsByUserId,
  getMeetingTranscriptsByMeetingId,
  uploadMeeting,
} from "@/actions/meeting/repository";
import { getTeamMembers } from "@/actions/user/repository";

export const projectRouter = createTRPCRouter({
  getTeamMembers: privateProcedure
    .input(getProjectIdSchema)
    .query(async ({ input }) => await getTeamMembers(input?.projectId)),
  createProject: privateProcedure
    .input(createProjectValidationSchema)
    .mutation(async ({ ctx, input }) => {
      const project = await createProject(ctx.user.userId!, input);

      //* Auto Index Github Repo
      await indexGithubRepo(
        project?.id,
        input?.githubUrl ?? "",
        input?.githubToken,
      );

      //* Auto Poll Commits
      await pollCommits(project?.id);
      return project;
    }),
  getProjects: privateProcedure.query(
    async ({ ctx }) => await getProjectsByUserId(ctx.user.userId!),
  ),

  getProjectById: privateProcedure
    .input(getProjectIdSchema)
    .query(async ({ input }) => await getProjectById(input?.projectId)),

  getCommits: privateProcedure
    .input(getProjectIdSchema)
    .query(async ({ input }) => {
      //* Auto Poll Commits for newer commits
      await pollCommits(input?.projectId)
        .then(() => {
          console.log("Commits polled successfully");
        })
        .catch(console.error);

      return await getCommitsByProjectId(input?.projectId);
    }),
  saveAnswer: privateProcedure
    .input(createQuestionValidationSchema)
    .mutation(
      async ({ ctx, input }) => await saveAnswer(ctx.user.userId!, input),
    ),
  getQuestions: privateProcedure
    .input(getProjectIdSchema)
    .query(
      async ({ input, ctx }) =>
        await getQuestionsByProjectId(input?.projectId, ctx.user.userId!),
    ),
  getQuestionsByUserId: privateProcedure.query(
    async ({ ctx }) => await getQuestionsByUserId(ctx.user.userId!),
  ),
  getQuestionsByProjectIdAndUserId: privateProcedure
    .input(getProjectIdSchema)
    .query(
      async ({ input, ctx }) =>
        await getQuestionsByProjectIdAndUserId(
          input?.projectId,
          ctx.user.userId!,
        ),
    ),

  createMeeting: privateProcedure
    .input(createMeetingValidationSchema)
    .mutation(async ({ input }) => {
      return await uploadMeeting(input);
    }),
  getMeetingsByProjectId: privateProcedure
    .input(getProjectIdSchema)
    .query(async ({ input }) => {
      return await getMeetingsByProjectId(input?.projectId);
    }),
  getMeetingById: privateProcedure
    .input(getMeetingIdSchema)
    .query(async ({ input }) => await getMeetingById(input?.meetingId)),
  getMeetingTranscripts: privateProcedure
    .input(getMeetingIdSchema)
    .query(
      async ({ input }) =>
        await getMeetingTranscriptsByMeetingId(input?.meetingId),
    ),
  getMeetingsUserHasAccessTo: privateProcedure
    .input(getProjectIdSchema)
    .query(
      async ({ input, ctx }) =>
        await getMeetingsByUserId(ctx.user.userId!, input?.projectId),
    ),
  deleteMeeting: privateProcedure
    .input(getMeetingIdSchema)
    .mutation(async ({ input }) => await deleteMeeting(input?.meetingId)),
  archiveProject: privateProcedure
    .input(getProjectIdSchema)
    .mutation(async ({ input }) => await archiveProject(input?.projectId)),
  unarchiveProject: privateProcedure
    .input(getProjectIdSchema)
    .mutation(async ({ input }) => await unarchiveProject(input?.projectId)),
  getArchivedProjects: privateProcedure.query(
    async ({ ctx }) => await getArchivedProjectsByUserId(ctx.user.userId!),
  ),
});
