"use client";
import React from "react";
import TranscriptsList from "../../../../components/modules/meetings/transcripts-list";

type Props = {
  params: Promise<{ id: string }>;
};

const MeetingDetailsPage = async ({ params }: Props) => {
  const { id: meetingId } = await params;

  return (
    <div>
      <TranscriptsList meetingId={meetingId} />
    </div>
  );
};

export default MeetingDetailsPage;
