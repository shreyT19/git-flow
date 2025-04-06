import { AnimatedTabs } from "@/components/aceternityui/animated-tabs";
import React from "react";
import CommitLogTab from "./tabs/commit-log";
import QnaTab from "./tabs/qna";
import MeetingsTab from "./tabs/meetings";
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
            <CommitLogTab
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
          content: <QnaTab project={project as IProjectResponse} />,
        },
        {
          icon: "presentation",
          title: "Meetings",
          value: "meetings",
          content: <MeetingsTab project={project as IProjectResponse} />,
        },
      ]}
      contentClassName="mt-6"
    />
  );
};

export default ViewProjectTabs;
