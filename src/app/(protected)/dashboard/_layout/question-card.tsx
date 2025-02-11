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
import React, { useState } from "react";

const QuestionCard = () => {
  const [question, setQuestion] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(question);
    setOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>GitFlow</DialogTitle>
          </DialogHeader>
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
            <Button className="w-fit" type="submit">
              Ask AI!
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default QuestionCard;
