"use client";
import React from "react";
import CommitLog from "./_layout/commit-log";
import HeaderActions from "./_layout/header-actions";
import QuestionCard from "./_layout/question-card";
import MeetingCard from "./_layout/meeting-card";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { IProjectResponse } from "@/types/project.types";
import { motion } from "motion/react";
import { ICommitResponse } from "@/types/commit.types";

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

  return (
    <div>
      <div className="mt-3 flex flex-col gap-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeaderActions
            isLoading={isProjectLoading || isCommitsLoading}
            project={project as IProjectResponse}
          />
        </motion.div>
        <motion.div
          className="grid grid-cols-5 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <QuestionCard
            project={project as IProjectResponse}
            isLoading={isProjectLoading || isCommitsLoading}
          />
          <MeetingCard
            isLoading={isProjectLoading || isCommitsLoading}
            project={project as IProjectResponse}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CommitLog
            isLoading={isProjectLoading || isCommitsLoading}
            project={project as IProjectResponse}
            commits={commits as ICommitResponse[]}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
