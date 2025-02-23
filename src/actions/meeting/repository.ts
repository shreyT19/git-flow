"use server";

import { db } from "@/server/db";
import { IMeetingBase } from "@/utils/meeting.utils";
import { EMeetingStatus } from "@prisma/client";

/**
 * Upload a meeting to the database
 * @param data - The meeting data
 * @returns The created meeting
 */
export const uploadMeeting = async (data: IMeetingBase) => {
  return await db.meeting.create({
    data: {
      ...data,
      status: EMeetingStatus.PROCESSING,
    },
  });
};

/**
 * Get a meeting by its id
 * @param id - The id of the meeting
 * @returns The meeting
 */
export const getMeetingById = async (id: string) => {
  return await db.meeting.findUnique({ where: { id } });
};

/**
 * Get meetings by project id
 * @param projectId - The id of the project
 * @returns The meetings
 */
export const getMeetingsByProjectId = async (projectId: string) => {
  return await db.meeting.findMany({
    where: { projectId },
    include: { meetingTranscripts: true },
  });
};
