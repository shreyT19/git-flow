"use client";
import { Input } from "@/components/ui/input";
import type { ICreateProject } from "@/types/project.types";
import Image from "next/image";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectValidationSchema } from "@/utils/project.utils";
import { Button } from "@/components/ui/button";

const CreateProjectPage = () => {
  const { register, handleSubmit, reset, formState } = useForm<ICreateProject>({
    resolver: zodResolver(createProjectValidationSchema),
  });
  console.log(formState.errors);

  const onFormSubmit: SubmitHandler<ICreateProject> = (data) => {
    console.log(data);
  };

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <Image
        alt="Image Placeholder"
        src="/undraw_developer_activity.svg"
        width={224}
        height={224}
      />
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-semibold">Link your GitHub repository</h1>
          <p className="text-sm text-muted-foreground">
            Enter the URL of your GitHub repository to get started.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            {...register("projectName")}
            placeholder="Project Name"
            description={formState.errors.projectName?.message}
            descriptionClassName="!text-red-500 text-s"
          />
          <Input
            {...register("repoUrl")}
            type="url"
            placeholder="Repository URL"
            description={formState.errors.repoUrl?.message}
            descriptionClassName="!text-red-500 text-s"
          />
          <Input
            {...register("githubToken")}
            placeholder="Github Token (Optional)"
            description={formState.errors.githubToken?.message}
            descriptionClassName="!text-red-500 text-s"
          />
          <Button className="w-fit" type="submit">
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;
