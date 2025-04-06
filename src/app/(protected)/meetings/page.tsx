"use client";
import React, { useState } from "react";
import { api } from "@/trpc/react";
import { EMeetingStatus } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/global/Datatable";
import { SlideUpDiv } from "@/components/global/MotionTag";
import { TitleDescriptionBox } from "@/components/global/Layouts/title-description-box";
import useProject from "@/services/project";

const MeetingsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: meetings,
    isLoading,
    refetch: refetchMeetings,
  } = api.project.getMeetingsUserHasAccessTo.useQuery(undefined, {
    refetchInterval: 4000,
  });

  const filteredMeetings = meetings?.filter((meeting) =>
    meeting.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SlideUpDiv className="container mx-auto space-y-6 py-8">
      <TitleDescriptionBox
        title="Meetings"
        titleAs="h1"
        description="View and manage all your meetings"
      />

      <DataTable
        data={filteredMeetings || []}
        columns={[
          {
            header: "Meeting Name",
            accessorKey: "name",
            cell: (info) => (
              <div className="flex items-center gap-2">
                <span className="font-medium">{info.getValue() as string}</span>
                {info.row.original.status === EMeetingStatus.PROCESSING && (
                  <Badge className="bg-yellow-500 text-white">
                    Processing...
                  </Badge>
                )}
              </div>
            ),
          },
          {
            header: "Project",
            accessorKey: "projectId",
            cell: (info) => (
              <Link
                href={`/projects/${info.getValue()}`}
                className="font-medium text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the row click event from firing
                }}
              >
                {info.row.original?.project?.name}
              </Link>
            ),
          },
          {
            header: "Created At",
            accessorKey: "createdAt",
            meta: { type: "date" },
          },
        ]}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRefresh={refetchMeetings}
        emptyStateProps={{
          searchText: "No meetings found matching your search.",
          defaultText: "No meetings found. Upload a meeting to get started!",
          searchAction: {
            label: "Clear search",
            onClick: () => setSearchQuery(""),
          },
        }}
        onRowClick={(row) => {
          window.open(`/meetings/${row.id}`, "_blank");
        }}
        isLoading={isLoading}
      />
    </SlideUpDiv>
  );
};

export default MeetingsPage;
