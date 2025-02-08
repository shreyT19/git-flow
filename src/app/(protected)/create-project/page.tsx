"use client";
import { Input } from "@/components/ui/input";
import type { ICreateProject } from "@/types/project.types";
import Image from "next/image";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectValidationSchema } from "@/utils/project.utils";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const CreateProjectPage = () => {
  const { register, handleSubmit, reset, formState } = useForm<ICreateProject>({
    resolver: zodResolver(createProjectValidationSchema),
  });

  const createProject = api.project.createProject.useMutation();

  const onFormSubmit: SubmitHandler<ICreateProject> = async (data) => {
    createProject.mutate(data, {
      onSuccess: () => {
        toast.success("Wohoo! Project created successfully 🎉");
        reset();
      },
      onError: (error) =>
        toast.error(
          `There was an error creating the project 😢 : ${error?.message}`,
        ),
    });
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
            {...register("name")}
            placeholder="Project Name"
            description={formState.errors.name?.message}
            descriptionClassName="!text-red-500 text-s"
          />
          <Input
            {...register("githubUrl")}
            type="url"
            placeholder="Repository URL"
            description={formState.errors.githubUrl?.message}
            descriptionClassName="!text-red-500 text-s"
          />
          <Input
            {...register("githubToken")}
            placeholder="Github Token (Optional)"
            description={formState.errors.githubToken?.message}
            descriptionClassName="!text-red-500 text-s"
          />
          <Button
            className="w-fit"
            type="submit"
            disabled={createProject.isPending}
          >
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectPage;
