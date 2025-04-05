"use client";
import React, { useState } from "react";
import FileReferences from "../projects/[id]/_layout/file-references";
import { api } from "@/trpc/react";
import { IQuestionResponse } from "@/types/question.types";
import ToolTip from "@/components/ui/tooltip";
import { ISourceCodeEmbedding } from "@/types/sourceCodeEmbedding.types";
import { Skeleton } from "@/components/ui/skeleton";
import { getIconForKeyword } from "@/utils/icons.utils";
import DataTable from "@/components/global/Datatable";
import { SlideUpDiv } from "@/components/global/MotionTag";
import { TitleDescriptionBox } from "@/components/global/Layouts/TitleDescriptionBox";
import Link from "next/link";

const QnaPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<IQuestionResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: questions,
    isFetching: isLoading,
    refetch: refetchQuestions,
  } = api.project.getQuestionsByUserId.useQuery();

  const filteredQuestions = questions?.filter((question) =>
    question.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <FileReferences
        open={open && selectedQuestion !== null}
        onOpenChange={() => {
          setOpen(false);
          setSelectedQuestion(null);
        }}
        fileReferences={
          selectedQuestion?.fileReferences as ISourceCodeEmbedding[]
        }
        answer={selectedQuestion?.answer ?? ""}
      />

      <SlideUpDiv className="container mx-auto space-y-6 py-8">
        <TitleDescriptionBox
          title="Questions & Answers"
          titleAs="h1"
          description="View all questions asked across your projects"
        />

        <div className="overflow-hidden">
          <DataTable
            data={filteredQuestions || []}
            columns={[
              {
                header: "Question",
                accessorKey: "question",
                cell: (info) => (
                  <span className="font-medium">
                    {info.getValue() as string}
                  </span>
                ),
              },
              {
                header: "Project",
                accessorKey: "project.name",
                cell: (info) => (
                  <Link
                    href={`/projects/${info.row.original.project.id}`}
                    className="font-medium text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the row click event from firing
                    }}
                  >
                    {info.getValue() as string}
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
            onRefresh={refetchQuestions}
            emptyStateProps={{
              searchText: "No questions found matching your search.",
              defaultText: "No questions found. Ask a question in a project!",
              searchAction: {
                label: "Clear search",
                onClick: () => setSearchQuery(""),
              },
            }}
            onRowClick={(row) => {
              setSelectedQuestion(row as unknown as IQuestionResponse);
              setOpen(true);
            }}
            isLoading={isLoading}
          />
        </div>
      </SlideUpDiv>
    </>
  );
};

export default QnaPage;
