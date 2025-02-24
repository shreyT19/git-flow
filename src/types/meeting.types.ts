import { IMeeting } from "@/utils/meeting.utils";
import { IBaseResponseSchema } from "./types";

export interface IMeetingSummary {
  start: string;
  end: string;
  transcript: string;
  headline: string;
  summary: string;
}

export interface IMeetingSummaryResponse
  extends IMeetingSummary,
    IBaseResponseSchema {}

export interface IMeetingResponse extends IMeeting, IBaseResponseSchema {}
