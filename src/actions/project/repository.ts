"use server";

import { db } from "@/server/db";
import { IProjectBase } from "@/utils/project.utils";

/**
 *  Get a project details by id
 * @param project
 * @returns
 */
export const getProjectById = async (projectId: string) => {
  return await db.project.findUnique({
    where: {
      id: projectId,
    },
  });
};

/**
 * Create a project
 * @param userId - The user's ID
 * @param project - The project to create
 * @returns The created project
 */
export const createProject = async (userId: string, project: IProjectBase) => {
  return await db.project.create({
    data: {
      name: project?.name,
      githubUrl: project?.githubUrl ?? "",
      userToProjects: {
        create: {
          userId: userId,
        },
      },
    },
  });
};

/**
 * Get projects by user ID
 * @param userId - The user's ID
 * @returns The projects
 */
export const getProjectsByUserId = async (userId: string) => {
  return await db.project.findMany({
    where: {
      userToProjects: {
        some: {
          userId: userId,
        },
      },
      deletedAt: null,
    },
  });
};
