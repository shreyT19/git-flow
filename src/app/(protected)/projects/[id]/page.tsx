"use client";
import React, { useMemo } from "react";
import HeaderActions from "./_layout/header-actions";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { IProjectResponse } from "@/types/project.types";
import { ICommitResponse } from "@/types/commit.types";
import { IUserResponse } from "@/types/user.types";
import { FadeInDiv } from "@/components/global/MotionTag";
import ViewProjectTabs from "./_layout/tabs/project-tabs";

const Dashboard = () => {
  const { id } = useParams();

  const { data: project, isLoading: isProjectLoading } =
    api.project.getProjectById.useQuery({
      projectId: id as string,
    });

  const { data: commits, isLoading: isCommitsLoading } =
    api.project.getCommits.useQuery({
      projectId: id as string,
    });

  const { data: teamMembers, isLoading: isTeamMembersLoading } =
    api.project.getTeamMembers.useQuery({
      projectId: id as string,
    });

  const isLoading = useMemo(
    () => isProjectLoading || isCommitsLoading || isTeamMembersLoading,
    [isProjectLoading, isCommitsLoading, isTeamMembersLoading],
  );

  return (
    <div>
      <div className="mt-3 flex flex-col gap-6 pb-12">
        <FadeInDiv className="sticky -top-2 z-[1] border-b bg-gray-50 pb-4 pt-2">
          <HeaderActions
            isLoading={isLoading}
            project={project as IProjectResponse}
            teamMembers={teamMembers as IUserResponse[]}
          />
        </FadeInDiv>
        <ViewProjectTabs
          isLoading={isLoading}
          project={project as IProjectResponse}
          commits={commits as ICommitResponse[]}
        />
      </div>
    </div>
  );
};

export default Dashboard;
