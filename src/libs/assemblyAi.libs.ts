import { IMeetingSummary } from "@/types/meeting.types";
import { AssemblyAI, Chapter } from "assemblyai";

const assemblyAi = new AssemblyAI({
  apiKey: process.env.NEXT_PUBLIC_ASSEMBLY_API_KEY,
});

const millisecondToTime = (millisecond: number) => {
  const seconds = Math.floor(millisecond / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours.toString().padStart(2, "0")}:${remainingMinutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const processMeetingWithAssemblyAI = async (
  meetingUrl: string,
): Promise<{ summaries: IMeetingSummary[] }> => {
  const transcript = await assemblyAi.transcripts.transcribe({
    audio: meetingUrl,
    auto_chapters: true,
    speaker_labels: true,
  });

  const summaries: IMeetingSummary[] =
    transcript?.chapters?.map((chapter: Chapter) => {
      return {
        start: millisecondToTime(chapter.start),
        end: millisecondToTime(chapter.end),
        transcript: chapter.gist,
        headline: chapter.headline,
        summary: chapter.summary,
      };
    }) ?? [];

  if (!transcript?.text)
    throw new Error("No transcript found for the meeting 🤔");

  return { summaries };
};
