"use client";
import type { ICommitResponse } from "@/types/commit.types";
import type { IProjectResponse } from "@/types/project.types";
import { cn } from "@/utils/tailwind.utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";

const CommitLog = ({
  isLoading,
  project,
  commits,
}: {
  isLoading: boolean;
  project: IProjectResponse;
  commits: ICommitResponse[];
}) => {
  if (isLoading) {
    return (
      <ul className="space-y-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <CommitCardSkeleton key={index} index={index} />
        ))}
      </ul>
    );
  }

  return (
    <>
      <ul className="space-y-6">
        {commits?.map((commit, index) => {
          return (
            <motion.div
              key={commit?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <CommitCard
                index={index}
                commit={commit}
                commitsLength={commits?.length}
                project={project}
              />
            </motion.div>
          );
        })}
      </ul>
    </>
  );
};

const CommitCardSkeleton = ({ index }: { index: number }) => {
  return (
    <li key={index} className="relative flex gap-x-4">
      <div className="absolute left-0 top-0 flex w-6 justify-center">
        <div className="translate-x-1 border-r border-dashed border-gray-200" />
      </div>
      <>
        <Skeleton className="relative size-8 flex-none rounded-full border-2 border-white bg-gray-200 shadow-xl" />
        <div className="flex-auto rounded-md border border-gray-200 bg-white p-3 shadow-md">
          <div className="flex justify-between gap-x-4">
            <div className="flex gap-1.5 py-0.5 text-xs leading-5">
              <Skeleton className="h-4 w-24 bg-gray-200" />
              <Skeleton className="h-4 w-16 bg-gray-200" />
            </div>
          </div>
          <Skeleton className="mt-1 h-5 w-3/4 bg-gray-200" />
          <Skeleton className="mt-2 h-16 w-full bg-gray-200" />
        </div>
      </>
    </li>
  );
};

const CommitCard = ({
  index,
  commitsLength,
  commit,
  project,
}: {
  index: number;
  commitsLength: number;
  commit: ICommitResponse;
  project: IProjectResponse;
}) => {
  return (
    <li key={index} className="relative flex gap-x-4">
      <div
        className={cn(
          index === commitsLength - 1 ? "" : "-bottom-6",
          "absolute left-0 top-0 flex w-6 justify-center",
        )}
      >
        <div className="translate-x-1 border-r border-dashed border-gray-200" />
      </div>
      <>
        <img
          src={commit?.commitAuthorAvatar ?? ""}
          alt="Avatar"
          height={32}
          width={32}
          className="relative size-8 flex-none rounded-full border-2 border-white bg-gray-50 shadow-xl"
        />
        <div className="flex-auto rounded-md border border-gray-200 bg-white p-3 shadow-md">
          <div className="flex justify-between gap-x-4">
            <Link
              target="_blank"
              href={`${project?.githubUrl}/commit/${commit?.commitHash}`}
              className="flex gap-1.5 py-0.5 text-xs leading-5 text-gray-500 transition-all duration-300 ease-out hover:!text-blue-600"
            >
              <span className="font-medium text-gray-900">
                {commit?.commitAuthorName}
              </span>
              <span className="inline-flex items-center gap-1">
                committed
                <ExternalLink className="size-3.5" />
              </span>
            </Link>
          </div>
          <span className="font-semibold">{commit?.commitMessage}</span>
          <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500">
            {commit?.summary}
          </pre>
        </div>
      </>
    </li>
  );
};

export default CommitLog;
