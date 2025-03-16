import { archiveProject } from "@/actions/project/repository";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";
import useProject from "@/services/project";
import { api } from "@/trpc/react";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

const HeaderActions = () => {
  const archiveProject = api.project.archiveProject.useMutation();
  const { selectedProjectDetails: project } = useProject();

  const { confirm, close } = useModal();

  const handleArchiveProject = () => {
    confirm({
      title: "Archive Project",
      children: (
        <p className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span>
            You will still be able to access the project under the archived
            projects. You will also be able to unarchive the project if you want
            to.
          </span>
          <span className="text-xs font-semibold text-red-500">
            Note: The archived project will be automatically deleted after 30
            days.
          </span>
        </p>
      ),
      cancelButtonProps: {
        onClick: close,
      },
      confirmButtonProps: {
        onClick: () =>
          archiveProject.mutate(
            { projectId: project?.id! },
            {
              onSuccess: () => {
                toast.success("Project archived successfully 🎉");
                close();
              },
              onError: (error) =>
                toast.error(
                  `There was an error archiving the project 😢 : ${error?.message}`,
                ),
            },
          ),
      },
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between">
      {/* Github Link */}
      <div className="w-fit rounded-md bg-primary px-4 py-3">
        <div className="flex items-center">
          <Github className="size-5 text-white" />
          <div className="ml-2">
            <p className="text-sm font-medium text-white">
              This project is linked to{" "}
              <Link
                href={project?.githubUrl ?? ""}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-white/80 hover:underline"
              >
                <span>{project?.githubUrl}</span>
                <ExternalLink className="size-4" />
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span>Team Members</span>
        <span>Invite Button</span>
        <Button variant="outline" onClick={handleArchiveProject}>
          Archive Project
        </Button>
      </div>
    </div>
  );
};

export default HeaderActions;
