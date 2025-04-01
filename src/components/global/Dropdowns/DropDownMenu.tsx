import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemProps,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/tailwind.utils";
import React from "react";

type Props = {
  actions: (DropdownMenuItemProps & { variant?: "destructive" | "default" })[];
  dropdownTrigger: React.ReactNode;
};

const DropDownMenu = ({ actions, dropdownTrigger }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{dropdownTrigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => (
          <DropdownMenuItem key={index} {...action} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenu;
