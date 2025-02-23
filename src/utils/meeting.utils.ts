import { EMeetingStatus } from "@prisma/client";
import { z } from "zod";

export const createMeetingValidationSchema = z.object({
  projectId: z.string(),
  meetingUrl: z.string(),
  name: z.string(),
  status: z.nativeEnum(EMeetingStatus).optional(),
});

export type IMeeting = z.infer<typeof createMeetingValidationSchema>;
