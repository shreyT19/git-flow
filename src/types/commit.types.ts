import type { IBaseResponseSchema } from "./types";

export interface IBaseCommit {
  commitMessage: string;
  commitHash: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: Date;
}

export interface ICreateCommit extends IBaseCommit {
  projectId: string;
  summary: string;
}

export interface ICommitResponse extends ICreateCommit, IBaseResponseSchema {}
