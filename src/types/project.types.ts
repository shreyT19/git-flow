import type { IBaseResponseSchema } from "./types";

export interface ICreateProject {
  name: string;
  githubUrl: string;
  githubToken: string;
}

export interface IProjectResponse extends ICreateProject, IBaseResponseSchema {
  deletedAt?: string;
}
