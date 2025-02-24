"use server";
import { auth } from "@clerk/nextjs/server";
import { createBulkMeetingTranscripts } from "@/actions/meeting/repository";
import { processMeetingWithAssemblyAI } from "@/libs/assemblyAi.libs";
import { processMeetingValidationSchema } from "@/utils/meeting.utils";
import { NextRequest, NextResponse } from "next/server";

//api/process-meeting
export const POST = async (req: NextRequest) => {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized User 🧐" },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const { meetingUrl, meetingId } =
      processMeetingValidationSchema.parse(body);

    const { summaries } = await processMeetingWithAssemblyAI(meetingUrl);

    await createBulkMeetingTranscripts(meetingId, summaries);
    return NextResponse.json(
      {
        success: true,
        message: "Meeting processed successfully 🎉",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error 🤕" },
      { status: 500 },
    );
  }
};
