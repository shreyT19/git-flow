import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SaveIcon, Workflow } from "lucide-react";
import React from "react";
import CodeReferences from "./code-references";
import MDEditor from "@uiw/react-md-editor";
import { ISourceCodeEmbedding } from "@/types/sourceCodeEmbedding.types";

type Props = {
  open: boolean;
  onOpenChange: () => void;
  answer: string;
  fileReferences: ISourceCodeEmbedding[];
  sheetHeader?: React.ReactNode;
};

const FileReferences = ({
  open,
  onOpenChange,
  answer,
  fileReferences,
  sheetHeader,
}: Props) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-4 overflow-y-auto sm:max-w-[80dvw]">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <SheetTitle className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              GitFlow
            </SheetTitle>
            {sheetHeader}
          </div>
        </SheetHeader>
        <div data-color-mode="light" className="flex flex-col gap-4">
          <MDEditor.Markdown source={answer} />
          <CodeReferences fileReferences={fileReferences} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FileReferences;
