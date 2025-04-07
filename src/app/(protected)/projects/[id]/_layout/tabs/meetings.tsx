import ConditionalWrapper from "@/components/global/ConditionalWrapper";
import React from "react";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { IProjectResponse } from "@/types/project.types";
import { getIconForKeyword } from "@/utils/icons.utils";
import { EMeetingStatus } from "@prisma/client";
import EmptyPlaceHolder from "@/components/global/Layouts/empty-placeholder";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import UploadMeetingCard from "@/components/modules/meetings/upload-meeting-card";

const MeetingsTab = ({ project }: { project: IProjectResponse }) => {
  return (
    <div className="flex flex-col gap-4">
      <UploadMeetingCard project={project} />
      <ProjectMeetings projectId={project?.id ?? ""} />
    </div>
  );
};

const ProjectMeetings = ({ projectId }: { projectId: string }) => {
  const { data: meetings, isLoading } =
    api.project.getMeetingsByProjectId.useQuery(
      { projectId },
      { refetchInterval: 4000 }, //* Refetch every 4 seconds to check if the meeting has been processed or not
    );

  return (
    <div className="mt-3 flex h-full flex-col gap-3">
      <ConditionalWrapper show={isLoading}>
        <div className="mt-3 flex h-full w-full flex-col gap-3 divide-y divide-gray-200">
          {Array.from({ length: 3 }).map((_, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-x-6 py-5"
            >
              <div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-x-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <Skeleton className="h-9 w-28" />
              </div>
            </li>
          ))}
        </div>
      </ConditionalWrapper>
      <EmptyPlaceHolder
        visible={meetings?.length === 0 && !isLoading}
        icon="presentation"
        text="Upload a meeting to see it here"
      />
      <ConditionalWrapper
        show={Boolean(!isLoading && meetings && meetings.length > 0)}
        className="flex flex-col gap-3 divide-y divide-gray-200"
      >
        {meetings?.map((meeting, index) => {
          console.log("Meeting data:", meeting); // Debug full meeting object
          return (
            <li
              key={index}
              className="flex items-center justify-between gap-x-6 rounded-lg px-4 py-4 transition-all duration-200 hover:bg-gray-50"
            >
              <div className="flex flex-col">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/meetings/${meeting.id}`}
                      className="cursor-pointer text-sm font-medium text-gray-800 transition-colors hover:text-primary"
                    >
                      {meeting?.name || "Untitled Meeting"}
                    </Link>
                    {meeting.status === EMeetingStatus.PROCESSING && (
                      <Badge variant="warning">Processing</Badge>
                    )}
                    {meeting.status === EMeetingStatus.COMPLETED && (
                      <Badge variant="success">Completed</Badge>
                    )}
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-xs text-gray-400">
                  <div className="whitespace-nowrap">
                    {meeting?.createdAt.toLocaleDateString()}
                  </div>
                  <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                  <div className="truncate">
                    {meeting?.meetingTranscripts?.length} Transcripts
                  </div>
                </div>
              </div>
              <div>
                <button
                  onClick={() =>
                    window.open(`/meetings/${meeting.id}`, "_blank")
                  }
                  className="flex h-auto items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs transition-colors hover:border-primary hover:text-primary"
                >
                  {getIconForKeyword("presentation", "size-3")}
                  <span>View</span>
                </button>
              </div>
            </li>
          );
        })}
      </ConditionalWrapper>
    </div>
  );
};

export default MeetingsTab;
