"use client";
import { api } from "@/trpc/react";
import React from "react";

type Props = {
  params: { id: string };
};

const MeetingDetailsPage = ({ params }: Props) => {
  const { id: meetingId } = params;

  const { data: meeting } = api.project.getMeetingById.useQuery({ meetingId });

  const { data: transcripts } = api.project.getMeetingTranscripts.useQuery({
    meetingId,
  });
  console.log(transcripts);
  console.log(meeting);
  return (
    <div>
      <h1>{meeting?.name}</h1>
      <div>
        {transcripts?.map((transcript) => (
          <div key={transcript.id}>
            <h2>{transcript.headline}</h2>
            <p>{transcript.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingDetailsPage;
