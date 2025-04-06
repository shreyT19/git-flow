"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ISourceCodeEmbedding } from "@/types/sourceCodeEmbedding.types";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  fileReferences: ISourceCodeEmbedding[] | undefined;
};

const CodeReferences = ({ fileReferences }: Props) => {
  if (!fileReferences || fileReferences?.length === 0) return null;

  const [currentTab, setCurrentTab] = useState<string>(
    fileReferences?.[0]?.fileName ?? "",
  );
  return (
    <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value)}>
      <TabsList>
        {fileReferences?.map((fileReference, index) => (
          <TabsTrigger key={index} value={fileReference.fileName}>
            {fileReference.fileName}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={currentTab}>
        <SyntaxHighlighter
          language="typescript"
          style={oneDark}
          className="w-full rounded-md"
        >
          {
            fileReferences?.find(
              (fileReference) => fileReference.fileName === currentTab,
            )?.sourceCode
          }
        </SyntaxHighlighter>
      </TabsContent>
    </Tabs>
  );
};

export default CodeReferences;
