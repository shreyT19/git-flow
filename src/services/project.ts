import useLocalStorage from "@/hooks/useLocalStorage";
import { api } from "@/trpc/react";
import { useMemo } from "react";

const useProject = () => {
  const { data: projects } = api.project.getProjects.useQuery();
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage(
    "SELECTED_PROJECT_ID",
    "",
  );

  const selectedProjectDetails = useMemo(
    () => projects?.find((project) => project.id === selectedProjectId),
    [selectedProjectId, projects],
  );

  return {
    projects,
    selectedProjectId,
    selectedProjectDetails,
    setSelectedProjectId,
  };
};

export default useProject;
