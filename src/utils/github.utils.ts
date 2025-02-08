import {
  createBulkCommits,
  getCommitsByProjectId,
} from "@/actions/commit/repository";
import { getProjectById } from "@/actions/project/repository";
import axios from "axios";
import type {
  IBaseCommit,
  ICommitResponse,
  ICreateCommit,
} from "@/types/commit.types";
import { Octokit } from "octokit";
import { generateCommitSummaryFromAI } from "./ai.utils";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/**
 * Get the commit hashes from a github url
 * @description: Get the commit hashes from a github url and return the commit hashes as an array of strings in the format of \'commitHash: commitMessage\'.
 * @param githubUrl
 * @returns
 */
export const getCommitHashes = async (
  githubUrl: string,
): Promise<IBaseCommit[]> => {
  const [owner, repo] = githubUrl.split("/").slice(-2) as string[];

  if (!owner || !repo) {
    console.error("Invalid Github URL");
  }

  const { data } = await octokit.rest.repos.listCommits({
    repo: repo as string,
    owner: owner as string,
  });

  const sortedCommits = data.sort(
    (a: any, b: any) =>
      new Date(b?.commit?.author?.date as string).getTime() -
      new Date(a?.commit?.author?.date as string).getTime(),
  ) as any[];

  const sanitizedCommits: IBaseCommit[] = sortedCommits
    .slice(0, 10)
    .map((commit: any) => ({
      commitHash: commit?.sha,
      commitMessage: commit?.commit?.message ?? "",
      commitAuthorAvatar: commit?.commit?.author?.avatar_url ?? "",
      commitAuthorName: commit?.commit?.author?.name ?? "",
      commitDate: commit?.commit?.author?.data ?? "",
    }));
  return sanitizedCommits;
};

/**
 *  Poll commits from a github url
 * @description: Poll commits from a github url and return the commit hashes as an array of strings in the format of \'commitHash: commitMessage\'.
 * @param projectId
 * @returns
 */
export const pollCommits = async (projectId: string) => {
  //* Get the project by id
  const project = await getProjectById(projectId);

  //! Check if the project has a github url
  if (!project?.githubUrl) {
    throw new Error("Project does not have a github url 🧐");
  }

  //* Get the commit hashes from the github url
  const commitHashes = await getCommitHashes(project?.githubUrl);

  //* Filter out the commits that have already been processed
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );

  //* Summarize the commits, returns a list of promises
  const summaryPromises = await Promise.allSettled(
    unprocessedCommits?.map((commit) =>
      summarizeCommit(project?.githubUrl, commit?.commitHash!),
    ),
  );

  //* Map the summaries to the commits
  const summaries = summaryPromises?.map((response) => {
    if (response?.status == "fulfilled") {
      return response?.value! as string;
    }
    return "";
  });

  //* Sanitize the commits data
  const commits = unprocessedCommits?.map((commit, index) => {
    return {
      ...commit,
      projectId,
      summary: summaries?.[index],
    };
  }) as ICreateCommit[];

  //* Create the commits
  return await createBulkCommits(commits);
};

/**
 * Filter unprocessed commits
 * @description: Filter out the commits that have already been processed
 * @param projectId
 * @param commitHashes
 * @returns
 */
const filterUnprocessedCommits = async (
  projectId: string,
  commitHashes: IBaseCommit[],
) => {
  const processedCommits: ICommitResponse[] =
    await getCommitsByProjectId(projectId);
  const unprocessedCommits = commitHashes?.filter(
    (commit) =>
      !processedCommits?.some(
        (processedCommit) => processedCommit?.commitHash === commit?.commitHash,
      ),
  );

  return unprocessedCommits;
};

/**
 * Summarize a commit
 * @description: Summarize a commit and return the summary
 * @param githubUrl
 * @param commitHash
 * @returns
 */
const summarizeCommit = async (
  githubUrl: string,
  commitHash: string,
): Promise<string | null> => {
  try {
    //? How is diff fetched?
    //* https://www.github.com/{repoOwner}/{repoName}/commit/{commitHash}.diff
    const { data: gitCommitDiff } = await axios.get(
      `${githubUrl}/commit/${commitHash}.diff`,
      {
        headers: {
          Accept: "application/vnd.github.v3.diff", //* Custom header format used by github
        },
      },
    );

    return await generateCommitSummaryFromAI(gitCommitDiff);
  } catch (error) {
    console.error("Error summarizing commit:", error);
    return null;
  }
};
