"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import useProject from "@/services/project";
import DataTable from "@/components/global/Datatable";
import { SlideUpDiv } from "@/components/global/MotionTag";
import { TitleDescriptionBox } from "@/components/global/Layouts/TitleDescriptionBox";
import router from "next/router";

const ProjectsPage = () => {
  const { projects } = useProject();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects?.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [rerenderKey, setRerenderKey] = useState(0);

  return (
    <SlideUpDiv className="container mx-auto space-y-6 py-8" key={rerenderKey}>
      <div className="flex items-center justify-between">
        <TitleDescriptionBox
          title="Projects"
          titleAs="h1"
          description="Manage your projects (e.g. github repositories)"
        />
        <div>
          <Button
            onClick={() => setRerenderKey((prev) => prev + 1)}
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
            searchIcon: (
              <Search className="mb-2 h-8 w-8 text-muted-foreground/50" />
            ),
            defaultIcon: (
              <Plus className="mb-2 h-8 w-8 text-muted-foreground/50" />
            ),
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
          onRefresh={() => setRerenderKey((prev) => prev + 1)}
          // isLoading={true}
          rowActions={[
            {
              label: "View Details",
              onClick: () => {},
            },
            {
              label: "Edit",
              onClick: () => {},
            },
            {
              label: "Delete",
              variant: "destructive",
              onClick: () => {},
            },
          ]}
        />
      </div>
    </SlideUpDiv>
  );
};

export default ProjectsPage;
