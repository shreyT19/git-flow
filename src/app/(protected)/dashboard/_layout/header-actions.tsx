import useProject from "@/services/project";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import React from "react";

const HeaderActions = () => {
  const { selectedProjectDetails: project } = useProject();
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
        <span>Archive Button</span>
      </div>
    </div>
  );
};

export default HeaderActions;
