import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { IMeetingSummaryResponse } from "@/types/meeting.types";
import { VideoIcon } from "lucide-react";
import React, { useState } from "react";

// TODOS: Improve the card design, the accessiblity

type Props = {
  meetingId: string;
};

const TranscriptsList = ({ meetingId }: Props) => {
  const { data: meeting, isLoading } = api.project.getMeetingById.useQuery({
    meetingId,
  });
  console.log(meeting);

  if (isLoading) return <div>Loading...</div>;

  if (!meeting) return <div>Meeting not found</div>;

  return (
    <div className="flex flex-col gap-y-4 p-8">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 border-b pb-6 lg:mx-0 lg:max-w-none">
        <div className="flex items-start gap-x-6">
          <div className="rounded-full border bg-white p-3">
            <VideoIcon className="h-6 w-6" />
          </div>
          <h1>
            <div className="text-sm leading-6 text-gray-600">
              Meeting on {meeting?.createdAt.toLocaleDateString()}
            </div>
            <div className="text-base font-semibold leading-6 text-gray-900">
              {meeting?.name}
            </div>
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {meeting?.meetingTranscripts?.map((transcript) => (
          <TranscriptCard key={transcript?.id} transcript={transcript} />
        ))}
      </div>
    </div>
  );
};

const TranscriptCard = ({
  transcript,
}: {
  transcript: IMeetingSummaryResponse;
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  console.log(modalOpen);
  return (
    <>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{transcript?.transcript}</DialogTitle>
            <DialogDescription>
              {transcript?.createdAt.toLocaleDateString()}
            </DialogDescription>
            <p className="text-gray-600">{transcript?.headline}</p>
            <blockquote className="mt-2 border-l-4 border-gray-300 bg-gray-50 p-4">
              <span className="text-sm text-gray-600">
                {transcript?.start} - {transcript?.end}
              </span>
              <p className="text-sm font-medium italic leading-relaxed text-gray-900">
                {transcript?.summary}
              </p>
            </blockquote>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader className="flex flex-col gap-y-2">
          <CardTitle className="text-base">{transcript?.headline}</CardTitle>
          <div className="" />
          <CardDescription className="text-sm">
            {transcript?.summary}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => setModalOpen(true)}>
            Details
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default TranscriptsList;
