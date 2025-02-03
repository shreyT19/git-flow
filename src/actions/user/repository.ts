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
