"use server";

import { db } from "@/server/db";
import type { IMeetingSummary } from "@/types/meeting.types";
import { IMeeting } from "@/utils/meeting.utils";
import { EMeetingStatus } from "@prisma/client";

/**
 * Upload a meeting to the database
 * @param data - The meeting data
 * @returns The created meeting
 */
export const uploadMeeting = async (data: IMeeting) => {
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
  return await db.meeting.findUnique({
    where: { id },
    include: { meetingTranscripts: true },
  });
};

/**
 * Get meetings by project id
 * @param projectId - The id of the project
 * @returns The meetings
 */
export const getMeetingsByProjectId = async (projectId: string) => {
  return await db.meeting.findMany({
    where: { projectId },
    include: {
      meetingTranscripts: {
        select: {
          id: true,
          headline: true,
          summary: true,
          meetingId: true,
          createdAt: true,
          updatedAt: true,
          start: true,
          end: true,
          transcript: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Create bulk meeting transcripts
 * @param meetingId - The id of the meeting
 * @param data - The meeting transcripts
 * @returns The created meeting transcripts
 */
export const createBulkMeetingTranscripts = async (
  meetingId: string,
  data: IMeetingSummary[],
) => {
  //* Create meeting transcripts
  const res = await db.meetingTranscript.createMany({
    data: data.map((summary) => ({
      ...summary,
      meetingId,
    })),
  });

  //* Update meeting status to COMPLETED
  return await db.meeting.update({
    where: { id: meetingId },
    data: { status: EMeetingStatus.COMPLETED, name: data?.[0]?.headline },
  });
};

export const deleteMeeting = async (id: string) =>
  await db.meeting.delete({ where: { id } });

export const getMeetingTranscriptsByMeetingId = async (meetingId: string) =>
  await db.meetingTranscript.findMany({ where: { meetingId } });

export const getMeetingsByUserId = async (userId: string, projectId: string) =>
  await db.meeting.findMany({
    where: {
      projectId,
      project: {
        userToProjects: {
          some: {
            userId,
          },
        },
      },
    },
  });
