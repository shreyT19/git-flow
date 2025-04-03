"use server";

import { db } from "@/server/db";
import type { IUser } from "@/types/user.types";

/**
 *  Upsert a user into the database
 *  Adds the user if they don't exist
 *  Updates the user if they do exist
 * @param user
 * @returns
 */
export const upsertUser = async (user: IUser) => {
  return await db.user.upsert({
    where: {
      emailAddress: user?.emailAddress ?? "",
    },
    update: {
      imageURL: user?.imageURL,
      firstName: user?.firstName,
      lastName: user?.lastName,
    },
    create: {
      id: user?.id,
      emailAddress: user?.emailAddress ?? "",
      imageURL: user?.imageURL,
      firstName: user?.firstName,
      lastName: user?.lastName,
    },
  });
};

/**
 *  Get a user by their id
 *  Returns the user object
 * @param userId
 * @returns
 */
export const getUserById = async (userId: string) => {
  return await db.user.findUnique({
    where: { id: userId },
  });
};

/**
 *  Add a user to a project
 *  Creates a new user to project relationship
 *  Returns the user to project relationship
 *  If the user is already in the project, it will return the existing relationship
 * @param userId
 * @param projectId
 * @returns
 */
export const addUserToProject = async (userId: string, projectId: string) => {
  return await db.userToProject.upsert({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
    update: {},
    create: {
      userId,
      projectId,
    },
  });
};

/**
 *  Get all team members for a project
 *  Returns an array of user objects
 * @param projectId
 * @returns
 */
export const getTeamMembers = async (projectId: string) => {
  return await db.userToProject.findMany({
    where: {
      projectId,
    },
    include: {
      user: true,
    },
  });
};
