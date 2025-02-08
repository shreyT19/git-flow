import { db } from "@/server/db";
import type { ICreateCommit } from "@/types/commit.types";

/**
 * Get all commits for a project
 * @param projectId
 * @returns
 */
export const getCommitsByProjectId = async (projectId: string) => {
  return await db.commit.findMany({
    where: {
      projectId,
    },
  });
};

/**
 * Create bulk commits
 * @param commit
 * @returns
 */
export const createBulkCommits = async (commits: ICreateCommit[]) => {
  return await db.commit.createMany({
    data: commits?.map((commit) => {
      return {
        projectId: commit?.projectId ?? "",
        commitHash: commit?.commitHash ?? "",
        commitMessage: commit?.commitMessage ?? "",
        summary: commit?.summary ?? "",
        commitAuthorAvatar: commit?.commitAuthorAvatar ?? "",
        commitAuthorName: commit?.commitAuthorName ?? "",
        commitDate: commit?.commitDate ?? "",
      };
    }),
  });
};
