import { IProjectResponse } from "@/types/project.types";

import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/trpc/react";
import { IProcessMeeting } from "@/utils/meeting.utils";
import { toast } from "sonner";
import { uploadFileToAppWrite } from "@/libs/appwrite.libs";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { ChevronDown, ChevronUp, PresentationIcon, Upload } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import ConditionalWrapper from "@/components/global/ConditionalWrapper";
import {
  CollapsibleContent,
  CollapsibleTrigger,
  Collapsible,
} from "@/components/ui/collapsible";
import { getIconForKeyword } from "@/utils/icons.utils";

const UploadMeetingCard = ({ project }: { project: IProjectResponse }) => {
  const navigate = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { mutate: createMeeting } = api.project.createMeeting.useMutation();
  const processMeeting = useMutation({
    mutationFn: async (data: IProcessMeeting) => {
      const { meetingUrl, meetingId } = data;
      const res = await axios.post(
        "/api/process-meeting",
        { meetingUrl, meetingId },
        { timeout: 60 * 5 * 1000 }, // 5 minutes
      );

      return res.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".m4a", ".wav"],
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024,
    onDrop: async (files) => await handleUploadMeeting(files[0] as File),
  });

  const handleUploadMeeting = async (file: File) => {
    if (!project.id) return;
    if (!file) {
      toast.error("Oops! There was an error with your file 🤖");
      return;
    }

    setIsUploading(true);
    try {
      const downloadUrl = await uploadFileToAppWrite(file as File, setProgress);
      createMeeting(
        {
          meetingUrl: downloadUrl ?? "",
          name: file.name,
          projectId: project.id,
        },
        {
          onSuccess: (meeting) => {
            toast.success("Meeting uploaded successfully 🎉");
            navigate.push(`/meetings`);
            processMeeting.mutate({
              meetingUrl: downloadUrl ?? "",
              meetingId: meeting.id,
            });
          },
          onError: (error) =>
            toast.error(`Error uploading meeting 🙁: ${error}`),
        },
      );
    } catch (error) {
      console.error("Error uploading meeting 🙁: ", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="col-span-2 overflow-hidden border border-gray-200/80 bg-gradient-to-br from-white to-gray-50 shadow-sm transition-all duration-300">
      <Collapsible open={!isCollapsed}>
        <CollapsibleTrigger className="w-full">
          <div
            className="flex w-full items-center justify-between gap-2 px-1 py-3 transition-colors duration-200 hover:bg-gray-50/80"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <div className="px-5 pb-2 pt-3 font-semibold">
              <div className="flex items-center gap-2 text-gray-800">
                {getIconForKeyword("presentation", "size-4 text-primary")}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Meeting Upload
                </span>
              </div>
            </div>
            <div className="mr-6 rounded-full bg-gray-100 p-1 transition-all duration-200 hover:bg-primary/10">
              {isCollapsed ? (
                <ChevronDown className="size-4 text-gray-600" />
              ) : (
                <ChevronUp className="size-4 text-gray-600" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div
            {...getRootProps()}
            className="flex flex-col items-center justify-center gap-4 p-6"
          >
            <ConditionalWrapper show={!isUploading}>
              <div className="flex flex-col items-center justify-center gap-4 text-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <PresentationIcon className="h-8 w-8 text-primary" />
                </div>
                <div className="font-semibold text-gray-900">
                  Upload a new meeting
                </div>
                <div className="text-center text-sm text-gray-500">
                  Analyze your meeting with GitFlow
                  <br />
                  Powered by AI
                </div>
                <Button className="mt-2 rounded-full bg-primary px-6 transition-all hover:bg-primary/90">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Meeting
                  <input {...getInputProps()} className="hidden" />
                </Button>
              </div>
            </ConditionalWrapper>
            <ConditionalWrapper
              show={isUploading}
              className="relative flex flex-col items-center gap-3 py-4"
            >
              <CircularProgressbar
                value={progress}
                className="size-24"
                styles={buildStyles({
                  pathColor: "var(--primary)",
                  textColor: "var(--primary)",
                  trailColor: "#f0f0f0",
                })}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="absolute top-[38px] text-center text-sm font-medium text-primary">
                  {progress}%
                </div>
                <div className="mt-2 text-center text-sm text-gray-500">
                  Uploading your meeting...
                </div>
              </div>
            </ConditionalWrapper>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default UploadMeetingCard;
