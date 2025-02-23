"use client";
import React, { useState } from "react";
import QuestionCard from "../dashboard/_layout/question-card";
import FileReferences from "../dashboard/_layout/file-references";
import useProject from "@/services/project";
import { api } from "@/trpc/react";
import { IQuestionResponse } from "@/types/question.types";
import ToolTip from "@/components/ui/tooltip";
import { ISourceCodeEmbeddingBase } from "@/types/sourceCodeEmbedding.types";

const QnaPage = () => {
  const [open, setOpen] = useState<boolean>(false);

  const { selectedProjectId } = useProject();

  const { data: questions } = api.project.getQuestions.useQuery({
    projectId: selectedProjectId,
  });

  const [selectedQuestion, setSelectedQuestion] =
    useState<IQuestionResponse | null>(null);

  return (
    <>
      <div className="mt-3 flex flex-col gap-6">
        <QuestionCard />

        <div className="flex flex-col gap-3">
          <h1 className="text-lg font-semibold text-primary">
            Saved Questions
          </h1>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {questions?.map((question, index) => (
          <div
            key={index}
            className="flex gap-4 rounded-lg border bg-white p-4 shadow-md transition-all duration-300 hover:cursor-pointer hover:bg-gray-50"
            onClick={() => {
              setOpen(true);
              setSelectedQuestion(question as unknown as IQuestionResponse);
            }}
          >
            <ToolTip
              title={`${question?.user?.firstName} ${question?.user?.lastName}`}
            >
              <img
                src={question?.user?.imageURL ?? ""}
                className="h-8 w-8 rounded-full"
              />
            </ToolTip>
            <div className="flex flex-col text-left">
              <div className="flex w-full items-center justify-between gap-2">
                <p className="line-clamp-1 text-base font-medium text-gray-700 first-letter:uppercase">
                  {question?.question}
                </p>
                <p className="whitespace-nowrap text-sm text-gray-500">
                  {question?.createdAt.toLocaleDateString()}
                </p>
              </div>
              <p className="line-clamp-2 text-sm text-gray-500">
                {question?.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
      <FileReferences
        open={open && selectedQuestion !== null}
        onOpenChange={() => {
          setOpen(false);
          setSelectedQuestion(null);
        }}
        fileReferences={
          selectedQuestion?.fileReferences as ISourceCodeEmbeddingBase[]
        }
        answer={selectedQuestion?.answer ?? ""}
      />
    </>
  );
};

export default QnaPage;
