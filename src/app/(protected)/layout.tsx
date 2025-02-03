import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const SideBarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <main className="m-2 w-full">
        <div className="flex items-center gap-2 border border-sidebar-border bg-sidebar"></div>
      </main>
    </SidebarProvider>
  );
};

export default SideBarLayout;
