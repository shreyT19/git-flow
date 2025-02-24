import { EMeetingStatus } from "@prisma/client";
import { z } from "zod";

export const createMeetingValidationSchema = z.object({
  projectId: z.string(),
  meetingUrl: z.string(),
  name: z.string(),
  status: z.nativeEnum(EMeetingStatus).optional(),
});

export type IMeeting = z.infer<typeof createMeetingValidationSchema>;

export const processMeetingValidationSchema = z.object({
  meetingUrl: z.string(),
  meetingId: z.string(),
});

export type IProcessMeeting = z.infer<typeof processMeetingValidationSchema>;

export const getMeetingIdSchema = z.object({
  meetingId: z.string(),
});
