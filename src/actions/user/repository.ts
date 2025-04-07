"use server";

import { db } from "@/server/db";
import type { IUser, IUserResponse } from "@/types/user.types";

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
  return (await db.userToProject.findMany({
    where: {
      projectId,
    },
    include: {
      user: true,
    },
  })) as IUserResponse[];
};

/**
 *  Get the credits for a user
 *  Returns the user object with the credits
 * @param userId
 * @returns
 */
export const getUserCredits = async (userId: string) => {
  return await db.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
};

/**
 *  Get all credit transactions for a user
 *  Returns an array of credit transaction objects
 * @param userId
 * @returns
 */
export const getCreditTransactions = async (userId: string) => {
  return await db.creditTransaction.findMany({
    where: { userId },
  });
};

/**
 * Create a credit transaction
 *
 * @param userId
 * @param amount
 * @param description
 * @returns
 */
export const createCreditTransaction = async (
  userId: string,
  credits: number,
  transactionId: string,
) => {
  return await db.creditTransaction.create({
    data: {
      userId,
      credits,
      transactionId: transactionId,
    },
  });
};

/**
 * Update the credits for a user
 *
 * @param userId
 * @param credits
 * @returns
 */
export const updateUserCredits = async (userId: string, credits: number) => {
  return await db.user.update({
    where: { id: userId },
    data: {
      credits: {
        increment: credits,
      },
    },
  });
};
