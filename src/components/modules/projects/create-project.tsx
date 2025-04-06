import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ICreateProject } from "@/types/project.types";
import { SubmitHandler } from "react-hook-form";
import useRefetch from "@/hooks/useRefetch";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createProjectValidationSchema } from "@/utils/project.utils";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: () => void;
};

const CreateProject = ({ open, onOpenChange }: Props) => {
  const { register, handleSubmit, reset, formState, clearErrors } =
    useForm<ICreateProject>({
      resolver: zodResolver(createProjectValidationSchema),
    });

  const createProject = api.project.createProject.useMutation();
  const refetch = useRefetch();

  const onFormSubmit: SubmitHandler<ICreateProject> = async (data) => {
    createProject.mutate(data, {
      onSuccess: () => {
        toast.success("Wohoo! Project created successfully 🎉");
        refetch().catch(() => {
          console.error("There was an error refetching the projects 😢");
        });
        reset();
      },
      onError: (error) =>
        toast.error(
          `There was an error creating the project 😢 : ${error?.message}`,
        ),
    });
  };

  const handleCancel = () => {
    reset();
    clearErrors();
    onOpenChange();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 overflow-y-auto sm:max-w-[420px]">
        <SheetHeader className="space-y-0">
          <div className="flex items-center gap-2">
            <SheetTitle className="flex items-center gap-2 text-base">
              Add New Project
            </SheetTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Create a new project by linking your GitHub repository
          </p>
        </SheetHeader>
        <div className="flex h-full flex-1 flex-col">
          <div className="mb-8 flex justify-center">
            <Image
              alt="Link GitHub Repository"
              src="/undraw_developer_activity.svg"
              width={200}
              height={200}
              className="h-auto"
            />
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-xl font-semibold text-primary">
              Link your GitHub repository
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter the URL of your GitHub repository to get started.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex flex-col space-y-5"
          >
            <div className="space-y-4">
              <Input
                {...register("name")}
                placeholder="Project Name"
                className="h-10"
                description={formState.errors.name?.message}
                descriptionClassName="mt-1 text-sm text-red-500"
              />

              <Input
                {...register("githubUrl")}
                type="url"
                placeholder="Repository URL"
                className="h-10"
                description={formState.errors.githubUrl?.message}
                descriptionClassName="mt-1 text-sm text-red-500"
              />

              <Input
                {...register("githubToken")}
                placeholder="Github Token (Optional)"
                className="h-10"
                description={formState.errors.githubToken?.message}
                descriptionClassName="mt-1 text-sm text-red-500"
              />
            </div>

            <div className="grid w-full grid-cols-2 gap-2 pt-2">
              <Button
                className="px-6"
                type="submit"
                disabled={createProject.isPending}
                size="default"
              >
                {createProject.isPending ? "Creating..." : "Create Project"}
              </Button>
              <Button variant="outline" onClick={handleCancel} type="button">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateProject;
