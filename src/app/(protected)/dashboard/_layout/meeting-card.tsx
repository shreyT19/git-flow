import ConditionalWrapper from "@/components/global/ConditionalWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { uploadFileToAppWrite } from "@/libs/appwrite.libs";
import { PresentationIcon, Upload } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import useProject from "@/services/project";
import { useRouter } from "next/navigation";

const MeetingCard = () => {
  const navigate = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { selectedProjectId } = useProject();
  const { mutate: createMeeting } = api.project.createMeeting.useMutation();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".m4a", ".wav"],
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024,
    onDrop: async (files) => await handleUploadMeeting(files[0] as File),
  });

  const handleUploadMeeting = async (file: File) => {
    if (!selectedProjectId) return;
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
          projectId: selectedProjectId,
        },
        {
          onSuccess: () => {
            toast.success("Meeting uploaded successfully 🎉");
            navigate.push(`/meetings`);
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
    <Card
      {...getRootProps()}
      className="col-span-2 flex flex-col items-center justify-center gap-4 py-10"
    >
      <ConditionalWrapper show={!isUploading}>
        <div className="flex flex-col items-center justify-center gap-4 text-sm">
          <PresentationIcon className="h-10 w-10 animate-bounce" />
          <div className="font-semibold text-gray-900">
            Upload a new meeting
          </div>
          <div className="text-center text-sm text-gray-500">
            Analyze your meeting with GitFlow
            <br />
            Powered by AI
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Meeting
            <input {...getInputProps()} className="hidden" />
          </Button>
        </div>
      </ConditionalWrapper>
      <ConditionalWrapper
        show={isUploading}
        className="relative flex flex-col items-center gap-3"
      >
        <CircularProgressbar
          value={progress}
          className="size-20"
          styles={buildStyles({
            pathColor: "#000",
            textColor: "#000",
            trailColor: "#f0f0f0",
          })}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="absolute top-[30px] text-center text-sm text-gray-500">
            {progress}%
          </div>
          <div className="text-center text-sm text-gray-500">
            Uploading your meeting...
          </div>
        </div>
      </ConditionalWrapper>
    </Card>
  );
};

export default MeetingCard;
