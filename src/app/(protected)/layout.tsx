import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import AppSidebar from "./app-sidebar";

type Props = {
  children: React.ReactNode;
};

const SideBarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-2 flex w-full flex-col gap-4">
        <div className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar p-2 px-4 shadow">
          {/* <Searchbar/>  */}
          <div className="ml-auto">
            <UserButton />
          </div>
          {/* Main Content */}
        </div>
        <div className="h-[calc(100dvh-6rem)] overflow-y-auto rounded-lg border border-sidebar-border bg-sidebar p-2 px-4 shadow">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default SideBarLayout;
