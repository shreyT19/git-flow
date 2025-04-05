import { AnimatedTabs } from "@/components/aceternityui/animated-tabs";
import React from "react";
import CommitLog from "./commit-log";
import QuestionCard from "./question-card";
import MeetingCard from "./meeting-card";
import { IProjectResponse } from "@/types/project.types";
import { useQueryState } from "nuqs";
import { ICommitResponse } from "@/types/commit.types";

type Props = {
  isLoading: boolean;
  project: IProjectResponse;
  commits: ICommitResponse[];
};

const ViewProjectTabs = ({ isLoading, project, commits }: Props) => {
  const [tab, setTab] = useQueryState("tab", { defaultValue: "commits" });

  return (
    <AnimatedTabs
      activeTab={tab}
      onTabChange={setTab}
      tabs={[
        {
          icon: "gitCommit",
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
          icon: "bot",
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
          icon: "presentation",
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
  );
};

export default ViewProjectTabs;
