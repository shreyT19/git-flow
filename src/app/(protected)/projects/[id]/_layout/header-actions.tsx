import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";
import { api } from "@/trpc/react";
import { IProjectResponse } from "@/types/project.types";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ScriptCopyBtn } from "@/components/magicui/script-copy-btn";

const HeaderActions = ({
  project,
  isLoading,
}: {
  project: IProjectResponse;
  isLoading: boolean;
}) => {
  const archiveProject = api.project.archiveProject.useMutation();

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

  if (isLoading) {
    return (
      <div className="flex flex-wrap items-center justify-between">
        {/* Github Link Skeleton */}
        <div className="w-fit rounded-md bg-primary px-4 py-3">
          <div className="flex items-center">
            <Skeleton className="size-5 rounded-full bg-white/20" />
            <div className="ml-2">
              <Skeleton className="h-4 w-72 bg-white/20" />
            </div>
          </div>
        </div>
        {/* Actions Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-32 rounded-md bg-gray-200" />
          <Skeleton className="h-9 w-32 rounded-md bg-gray-200" />
          <Skeleton className="h-9 w-32 rounded-md bg-gray-200" />
        </div>
      </div>
    );
  }

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
        <InviteButton projectId={project?.id!} />
        <ArchiveProjectButton projectId={project?.id!} />
      </div>
    </div>
  );
};

const ArchiveProjectButton = ({ projectId }: { projectId: string }) => {
  const archiveProject = api.project.archiveProject.useMutation();
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
            { projectId },
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
    <Button
      variant="destructive"
      size="sm"
      iconPlacement="left"
      icon="trash"
      onClick={handleArchiveProject}
    >
      Archive
    </Button>
  );
};

const InviteButton = ({ projectId }: { projectId: string }) => {
  const { confirm, close } = useModal();

  const handleInviteUser = () => {
    const inviteUrl = `${window.location.origin}/join/${projectId}`;

    navigator.clipboard.writeText(inviteUrl).then(() => {
      toast.success("Invite link copied to clipboard ✅");
    });

    confirm({
      title: "Invite User",
      description:
        "Invite team members to collaborate on this project with you. They will have access to all project resources.",
      closeOnClickOutside: true,
      showActions: false,
      children: (
        <div>
          <ScriptCopyBtn
            showMultiplePackageOptions={false}
            codeLanguage="js"
            lightTheme="github-light"
            darkTheme="github-dark"
            commandMap={{
              invite: inviteUrl,
            }}
          />
        </div>
      ),
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      iconPlacement="left"
      icon="userPlus"
      onClick={handleInviteUser}
    >
      Invite
    </Button>
  );
};

export default HeaderActions;
