"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/services/project";
import type { ISourceCodeEmbeddingBase } from "@/types/sourceCodeEmbedding.types";
import { askQuestion } from "@/utils/streaming.utils";
import { readStreamableValue } from "ai/rsc";
import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "./code-references";

const QuestionCard = () => {
  const { selectedProjectDetails } = useProject();
  const [question, setQuestion] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileReferences, setFileReferences] =
    useState<ISourceCodeEmbeddingBase[]>();

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

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setAnswer("");
          setFileReferences([]);
          setQuestion("");
        }}
      >
        <DialogContent className="max-h-[80dvh] overflow-y-auto sm:max-w-[80dvw]">
          <DialogHeader>
            <DialogTitle>GitFlow</DialogTitle>
          </DialogHeader>
          <div data-color-mode="light" className="flex flex-col gap-4">
            <MDEditor.Markdown source={answer} />
            <CodeReferences fileReferences={fileReferences} />
          </div>
        </DialogContent>
      </Dialog>

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
    </>
  );
};

export default QuestionCard;
