"use client";
import React from "react";
import CommitLog from "./_layout/commit-log";
import HeaderActions from "./_layout/header-actions";
import QuestionCard from "./_layout/question-card";
import MeetingCard from "./_layout/meeting-card";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { IProjectResponse } from "@/types/project.types";
import { ICommitResponse } from "@/types/commit.types";
import { IUserResponse } from "@/types/user.types";
import { AnimatedTabs } from "@/components/aceternityui/animated-tabs";
import { FadeInDiv } from "@/components/global/MotionTag";
import { useQueryState } from "nuqs";

const Dashboard = () => {
  const { id } = useParams();
  const [tab, setTab] = useQueryState("tab", { defaultValue: "commits" });

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

  const isLoading =
    isProjectLoading || isCommitsLoading || isTeamMembersLoading;

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

        <AnimatedTabs
          key={isLoading ? "loading" : "loaded"}
          activeTab={tab}
          onTabChange={setTab}
          tabs={[
            {
              title: "Commits",
              value: "commits",
              content: (
                <CommitLog
                  isLoading={isLoading}
                  project={project as IProjectResponse}
                  commits={commits as ICommitResponse[]}
                />
              ),
            },
            {
              title: "Q&A",
              value: "qa",
              content: (
                <QuestionCard
                  project={project as IProjectResponse}
                  isLoading={isLoading}
                />
              ),
            },
            {
              title: "Meetings",
              value: "meetings",
              content: (
                <MeetingCard
                  isLoading={isLoading}
                  project={project as IProjectResponse}
                />
              ),
            },
          ]}
          containerClassName="mb-6"
          contentClassName="mt-6"
        />
      </div>
    </div>
  );
};

export default Dashboard;
