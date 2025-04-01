import type { IBaseResponseSchema } from "./types";

export type ICreateProject = {
  name: string;
  githubUrl: string;
  githubToken?: string;
};

export type IProjectResponse = ICreateProject & IBaseResponseSchema;
