"use client";
import React, { useMemo } from "react";
import ProjectHeaderWithActions from "./_layout/header";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { IProjectResponse } from "@/types/project.types";
import { ICommitResponse } from "@/types/commit.types";
import { IUserResponse } from "@/types/user.types";
import ViewProjectTabs from "./_layout/tabs/project-tabs";

const ViewProjectPage = () => {
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
        <ProjectHeaderWithActions
          isLoading={isLoading}
          project={project as IProjectResponse}
          teamMembers={teamMembers as IUserResponse[]}
        />
        <ViewProjectTabs
          isLoading={isLoading}
          project={project as IProjectResponse}
          commits={commits as ICommitResponse[]}
        />
      </div>
    </div>
  );
};

export default ViewProjectPage;
