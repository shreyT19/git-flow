"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { ISourceCodeEmbedding } from "@/types/sourceCodeEmbedding.types";
import { askQuestion } from "@/libs/streamingSDK.libs";
import { readStreamableValue } from "ai/rsc";
import React, { useState } from "react";
import { SaveIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import FileReferences from "../file-references";
import useRefetch from "@/hooks/useRefetch";
import { IProjectResponse } from "@/types/project.types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getIconForKeyword } from "@/utils/icons.utils";
import QnaPage from "@/app/(protected)/qna/page";
import { IQuestionResponse } from "@/types/question.types";
import ToolTip from "@/components/ui/tooltip";

const QuestionCardSkeleton = () => {
  return (
    <>
      <Card className="col-span-3">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const QnaLoadingSkeleton = () => {
  return (
    <div className="mt-4 flex flex-col gap-3">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="flex gap-4 rounded-lg border bg-white p-4 shadow-md"
        >
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex w-full flex-col text-left">
            <div className="flex w-full items-center justify-between gap-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

const QuestionCard = ({
  project: selectedProjectDetails,
  isLoading = false,
}: {
  project: IProjectResponse;
  isLoading?: boolean;
}) => {
  // File References Sidebar State
  const [open, setOpen] = useState<boolean>(false);

  // Question Card State
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [fileReferences, setFileReferences] =
    useState<ISourceCodeEmbedding[]>();

  // Save Answer Mutation
  const saveAnswer = api.project.saveAnswer.useMutation();
  const refetch = useRefetch();

  // Handle Save Answer
  const handleSaveAnswer = async () => {
    saveAnswer.mutate(
      {
        projectId: selectedProjectDetails?.id ?? "",
        question,
        answer,
        fileReferences: fileReferences ?? [],
      },
      {
        onSuccess: () => {
          toast.success("Answer saved successfully 🎉");
          refetch().catch(() => {
            console.error("There was an error refetching the projects 😢");
          });
        },
        onError: (error) =>
          toast.error(
            `There was an error saving the answer 😢 : ${error?.message}`,
          ),
      },
    );
  };

  if (isLoading) return <QuestionCardSkeleton />;

  return (
    <>
      {/* File References Sidebar */}
      <FileReferences
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setAnswer("");
          setFileReferences([]);
          setQuestion("");
        }}
        sheetHeader={
          <Button
            variant="outline"
            className="mr-4 flex items-center gap-2"
            onClick={handleSaveAnswer}
            disabled={saveAnswer.isPending}
          >
            <SaveIcon className="h-4 w-4" />
            Save Answer
          </Button>
        }
        fileReferences={fileReferences ?? []}
        answer={answer}
      />
      {/* Question Card */}
      <CollapsibleQuestionCard
        project={selectedProjectDetails}
        setOpen={setOpen}
        setAnswer={setAnswer}
        setFileReferences={setFileReferences}
      />
      {/* Questions */}
      <Questions projectId={selectedProjectDetails?.id ?? ""} />
    </>
  );
};

const CollapsibleQuestionCard = ({
  project,
  setOpen,
  setAnswer,
  setFileReferences,
}: {
  project: IProjectResponse;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  setFileReferences: React.Dispatch<
    React.SetStateAction<ISourceCodeEmbedding[] | undefined>
  >;
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const projectId = project?.id;
    e.preventDefault();
    if (!projectId) return;
    setLoading(true);

    const { stream, fileReferences } = await askQuestion(question, projectId);
    setOpen(true);
    setFileReferences(fileReferences);

    for await (const chunk of readStreamableValue(stream)) {
      if (chunk) {
        setAnswer((ans) => ans + chunk);
      }
    }

    setLoading(false);
  };
  return (
    <Card className="col-span-3 overflow-hidden border border-gray-200/80 bg-gradient-to-br from-white to-gray-50 shadow-sm transition-all duration-300">
      <Collapsible open={isCollapsed}>
        <CollapsibleTrigger className="w-full">
          <div
            className="flex w-full items-center justify-between gap-2 px-1 py-3 transition-colors duration-200 hover:bg-gray-50/80"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                {getIconForKeyword("fileQuestion", "size-4 text-primary")}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Ask a question
                </span>
              </CardTitle>
            </CardHeader>
            <div className="mr-6 rounded-full bg-gray-100 p-1 transition-all duration-200 hover:bg-primary/10">
              {getIconForKeyword(
                isCollapsed ? "chevronDown" : "chevronUp",
                "size-4 text-gray-600",
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="mt-3 px-6 pb-6 pt-4">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Textarea
                placeholder="Which file should I change to edit the homepage?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={5}
                className="resize-none rounded-xl border-gray-200 bg-white px-4 py-3 transition-all duration-200 focus:border-primary/30 focus:ring-1 focus:ring-primary/30"
              />
              <Button
                className="w-fit bg-gradient-to-r from-primary to-primary/90 px-6 py-2 text-sm font-medium transition-all duration-200"
                type="submit"
                loading={loading}
                disabled={question?.length === 0 || loading}
                loadingPosition="right"
                icon="arrowRight"
                iconPlacement="right"
              >
                Ask AI
              </Button>
            </form>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

const Questions = ({ projectId }: { projectId: string }) => {
  const [open, setOpen] = useState<boolean>(false);

  const { data: questions, isLoading } = api.project.getQuestions.useQuery({
    projectId,
  });

  const [selectedQuestion, setSelectedQuestion] =
    useState<IQuestionResponse | null>(null);

  if (isLoading) return <QnaLoadingSkeleton />;

  return (
    <>
      <div className="mt-3 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-lg font-semibold text-gray-500">
            Saved Questions
          </h1>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {questions?.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200/80 bg-gradient-to-br from-white to-gray-50 px-8 py-12 text-center shadow-sm">
            <div className="mb-3 rounded-full bg-gray-100/80 p-3">
              {getIconForKeyword("fileQuestion", "size-6 text-gray-400")}
            </div>
            <p className="text-gray-500">
              Ask a question about your project and save it to see it here
            </p>
          </div>
        ) : (
          questions?.map((question, index) => (
            <div
              key={index}
              className="group flex gap-4 rounded-xl border border-gray-200/80 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
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
                  className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                />
              </ToolTip>
              <div className="flex w-full flex-col text-left">
                <div className="flex w-full items-center justify-between gap-2">
                  <p className="line-clamp-1 text-base font-medium text-gray-800 first-letter:uppercase group-hover:text-primary">
                    {question?.question}
                  </p>
                  <p className="whitespace-nowrap text-xs font-medium text-gray-400">
                    {question?.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {question?.answer}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
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
    </>
  );
};

// const Questions

export default QuestionCard;
