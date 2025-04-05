"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import DataTable from "@/components/global/Datatable";
import { SlideUpDiv } from "@/components/global/MotionTag";
import { TitleDescriptionBox } from "@/components/global/Layouts/TitleDescriptionBox";
import { useRouter } from "next/navigation";
import CreateProject from "./__components/CreateProject";
import { api } from "@/trpc/react";

const ProjectsPage = () => {
  const {
    data: projects,
    isFetching: isLoading,
    refetch: refetchProjects,
  } = api.project.getProjects.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const filteredProjects = projects?.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <CreateProject open={open} onOpenChange={() => setOpen(!open)} />
      <SlideUpDiv className="container mx-auto space-y-6 py-8">
        <div className="flex items-center justify-between">
          <TitleDescriptionBox
            title="Projects"
            titleAs="h1"
            description="Manage your projects (e.g. github repositories)"
          />
          <div>
            <Button
              onClick={() => setOpen(true)}
              icon="plus"
              size="sm"
              effect="ringHover"
              iconPlacement="left"
            >
              Add New Project
            </Button>
          </div>
        </div>

        <div className="overflow-hidden">
          <DataTable
            data={filteredProjects || []}
            columns={[
              {
                header: "Name",
                accessorKey: "name",
                cell: (info) => (
                  <span className="font-medium text-primary">
                    {info.getValue() as string}
                  </span>
                ),
              },
              {
                header: "Repository",
                accessorKey: "githubUrl",
              },
              {
                header: "Last Updated",
                accessorKey: "updatedAt",
                meta: { type: "date" },
              },
              {
                header: "Status",
                meta: {
                  type: "tag",
                  metaData: { icon: "dot", variant: "success" },
                },
                cell: () => "Active",
              },
            ]}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            emptyStateProps={{
              searchText: "No projects found matching your search.",
              defaultText: "No projects found. Create your first project!",
              searchAction: {
                label: "Clear search",
                onClick: () => setSearchQuery(""),
              },
              defaultAction: {
                label: "New Project",
                icon: "plus",
                onClick: () => {},
              },
            }}
            onRowClick={(row) => router.push(`/projects/${row?.id}`)}
            onRefresh={refetchProjects}
            isLoading={isLoading}
          />
        </div>
      </SlideUpDiv>
    </>
  );
};

export default ProjectsPage;
