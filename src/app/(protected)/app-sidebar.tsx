"use client";
import ConditionalWrapper from "@/components/global/ConditionalWrapper";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import NAV_ITEMS from "@/constants/navItems";
import useProject from "@/services/project";
import { cn } from "@/utils/tailwind.utils";
import { Plus, Workflow } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const AppSidebar = () => {
  const pathName = usePathname();

  const { open } = useSidebar();

  const { projects, selectedProjectId, setSelectedProjectId } = useProject();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-center gap-2 pb-1 pt-2">
          <Workflow />
          <ConditionalWrapper show={open}>
            <h1 className="text-xl font-bold text-primary/80">GitFlow</h1>
          </ConditionalWrapper>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS?.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn({
                        "!bg-primary !text-white": pathName.includes(item.url),
                      })}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((project, index) => (
                <SidebarMenuItem
                  key={index}
                  onClick={() => setSelectedProjectId(project?.id)}
                >
                  <SidebarMenuButton asChild>
                    <div>
                      <div
                        className={cn(
                          "flex size-6 items-center justify-center rounded-sm border text-sm text-primary",
                          {
                            "bg-primary text-white":
                              project?.id === selectedProjectId,
                          },
                          { "w-8": !open },
                        )}
                      >
                        {project?.name?.[0]}
                      </div>
                      <ConditionalWrapper show={open}>
                        {project?.name}
                      </ConditionalWrapper>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem className="mt-3">
                <Link href="/create-project">
                  <Button
                    variant="outline"
                    className={cn({ "w-8": !open })}
                    size="sm"
                  >
                    <Plus />
                    <ConditionalWrapper show={open}>
                      Create Project
                    </ConditionalWrapper>
                  </Button>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
