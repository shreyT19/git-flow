"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/services/project";
import type { ISourceCodeEmbedding } from "@/types/sourceCodeEmbedding.types";
import { askQuestion } from "@/libs/streamingSDK.libs";
import { readStreamableValue } from "ai/rsc";
import React, { useState } from "react";
import { SaveIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import FileReferences from "./file-references";
import useRefetch from "@/hooks/useRefetch";

const QuestionCard = () => {
  const { selectedProjectDetails } = useProject();
  const [question, setQuestion] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileReferences, setFileReferences] =
    useState<ISourceCodeEmbedding[]>();

  const [answer, setAnswer] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const projectId = selectedProjectDetails?.id;
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

  const saveAnswer = api.project.saveAnswer.useMutation();
  const refetch = useRefetch();

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

  return (
    <>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Textarea
              placeholder="Which file should I change to edit the homepage?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button className="w-fit" type="submit" disabled={loading}>
              Ask AI!
            </Button>
          </form>
        </CardContent>
      </Card>
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
    </>
  );
};

export default QuestionCard;
