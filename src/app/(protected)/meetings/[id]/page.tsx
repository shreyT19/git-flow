"use client";
import React from "react";
import TranscriptsList from "./_components/transcripts-list";

type Props = {
  params: { id: string };
};

const MeetingDetailsPage = ({ params }: Props) => {
  const { id: meetingId } = params;

  return (
    <div>
      <TranscriptsList meetingId={meetingId} />
    </div>
  );
};

export default MeetingDetailsPage;
