"use server";

import { db } from "@/server/db";

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
