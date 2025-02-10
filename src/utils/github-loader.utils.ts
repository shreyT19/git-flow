import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken ?? "",
    branch: "main",
    ignoreFiles: [
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
    ],
    recursive: true,
    maxConcurrency: 7,
    unknown: "warn", // warns for unknown files e.g pdf, jpg, etc
  });
  const docs = await loader.load();
  return docs;
};


console.log(
  await loadGithubRepo(
    "https://github.com/shreyT19/Tanstack",
    process.env.GITHUB_TOKEN,
  ),
);