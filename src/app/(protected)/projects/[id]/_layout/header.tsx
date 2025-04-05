import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/ModalProvider";
import { api } from "@/trpc/react";
import { IProjectResponse } from "@/types/project.types";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ScriptCopyBtn } from "@/components/magicui/script-copy-btn";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import { IUserResponse } from "@/types/user.types";
import { getIconForKeyword } from "@/utils/icons.utils";
import { Badge } from "@/components/ui/badge";

const ProjectHeaderWithActions = ({
  project,
  isLoading,
  teamMembers,
}: {
  project: IProjectResponse;
  isLoading: boolean;
  teamMembers: IUserResponse[];
}) => {
  if (isLoading) return <ProjectHeaderSkeleton />;

  return (
    <div className="sticky -top-2 z-[1] flex flex-col gap-4 border-b bg-gray-50 pb-6 pt-2">
      {/* Project Details Row */}
      <ProjectDetailsRow project={project} />
      {/* Github and Team Row */}
      <GithubLinkRow project={project} teamMembers={teamMembers} />
    </div>
  );
};

const ProjectHeaderSkeleton = () => {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-lg py-2">
      {/* Project Title and Date Skeleton */}
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-8 w-48 rounded-md" />
          <Skeleton className="h-6 w-36 rounded-full" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      {/* Github and Team Row Skeleton */}
      <div className="flex flex-wrap items-center justify-between">
        <Skeleton className="h-11 w-64 rounded-lg" />
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="size-10 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
};

const ProjectDetailsRow = ({ project }: { project: IProjectResponse }) => {
  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-gray-700">
          {getIconForKeyword("bookCopy", "size-5 text-gray-500")}
          <h1 className="text-xl font-semibold tracking-tight text-gray-500">
            {project?.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="flex items-center bg-gray-100 text-gray-600"
          >
            {getIconForKeyword("gitCommit", "size-3.5")}
            Added on{" "}
            {new Date(project?.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Badge>
        </div>
      </div>
      <ArchiveProjectButton projectId={project?.id!} />
    </div>
  );
};

const GithubLinkRow = ({
  project,
  teamMembers,
}: {
  project: IProjectResponse;
  teamMembers: IUserResponse[];
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between">
      {/* Github Link */}
      {project?.githubUrl && (
        <div className="group flex items-center gap-3 overflow-hidden rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-primary/10 transition-all duration-300 hover:shadow-md hover:ring-primary/20">
          {getIconForKeyword("github", "size-4")}
          <Link
            href={project?.githubUrl}
            target="_blank"
            className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 transition-all duration-300 group-hover:text-primary"
          >
            <span className="max-w-[180px] truncate border-b border-dashed border-transparent transition-all duration-300 group-hover:border-primary md:max-w-[240px] lg:max-w-[320px]">
              {project?.githubUrl.replace(
                /https?:\/\/(www\.)?github\.com\//,
                "",
              )}
            </span>
            {getIconForKeyword("externalLink", "size-4")}
          </Link>
        </div>
      )}
      <div className="flex items-center gap-4">
        <TeamMembers members={teamMembers} />
        <InviteButton projectId={project?.id!} />
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
      closeOnClickOutside: true,
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

    navigator.clipboard
      .writeText(inviteUrl)
      .then(() => toast.success("Invite link copied to clipboard ✅"));

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
            onAfterCopy={() => {
              toast.success("Invite link copied to clipboard ✅");
              close();
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

const TeamMembers = ({ members }: { members: IUserResponse[] }) => {
  return (
    <AvatarCircles
      avatarUrls={
        members?.map((member) => {
          return {
            imageUrl: member?.user?.imageURL ?? "",
            name: `${member?.user?.firstName} ${member?.user?.lastName}`,
          };
        }) ?? []
      }
    />
  );
};

export default ProjectHeaderWithActions;
