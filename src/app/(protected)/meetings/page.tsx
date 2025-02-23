"use client";
import useProject from "@/services/project";
import { api } from "@/trpc/react";
import React from "react";
import MeetingCard from "../dashboard/_layout/meeting-card";
import { Loader2 } from "lucide-react";
import ConditionalWrapper from "@/components/global/ConditionalWrapper";
import Link from "next/link";
import { EMeetingStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MeetingsPage = () => {
  const { selectedProjectId: projectId } = useProject();

  const { data: meetings, isLoading } = api.project.getMeetings.useQuery(
    { projectId },
    {
      refetchInterval: 3000, //* Refetch every 3 seconds to check if the meeting has been processed or not
    },
  );

  if (meetings?.length === 0) {
    return (
      <div className="mt-3 flex h-full w-full items-center justify-center">
        <p className="text-sm text-muted-foreground">No meetings found</p>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      <MeetingCard />
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold text-primary">Meetings</h1>
      </div>
      <ConditionalWrapper show={isLoading}>
        <div className="mt-3 flex h-full w-full items-center justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      </ConditionalWrapper>
      <ConditionalWrapper
        show={!isLoading}
        className="flex flex-col gap-3 divide-y divide-gray-200"
      >
        {meetings?.map((meeting, index) => (
          <li
            key={index}
            className="flex items-center justify-between gap-x-6 py-5"
          >
            <div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/meetings/${meeting.id}`}
                    target="_blank"
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    {meeting.name}
                  </Link>
                  <ConditionalWrapper
                    show={meeting.status === EMeetingStatus.PROCESSING}
                  >
                    <Badge className="bg-yellow-500 text-white">
                      Processing...
                    </Badge>
                  </ConditionalWrapper>
                </div>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs text-gray-500">
                <div className="whitespace-nowrap">
                  {meeting?.createdAt.toLocaleDateString()}
                </div>
                <div className="truncate">
                  {meeting?.meetingTranscripts?.length} Transcripts
                </div>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <Link href={`/meetings/${meeting.id}`} target="_blank">
                <Button variant="outline">View Meeting</Button>
              </Link>
            </div>
          </li>
        ))}
      </ConditionalWrapper>
    </div>
  );
};

export default MeetingsPage;
