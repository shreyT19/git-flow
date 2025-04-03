import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  addUserToProject,
  getUserById,
  upsertUser,
} from "@/actions/user/repository";
import { getProjectById } from "@/actions/project/repository";

type Props = {
  params: Promise<{ projectId: string }>;
};

const JoinProject = async (props: Props) => {
  const { projectId } = await props.params;

  //* If user is not signed in, redirect to sign in page
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  //* Get user from clerk
  const client = await clerkClient();
  const user = await client.users.getUser(userId!);

  //* Get user from database
  const dbUser = await getUserById(userId!);
  //* Create new user in database if not exists
  if (!dbUser) {
    await upsertUser({
      id: userId!,
      emailAddress: user?.emailAddresses?.[0]?.emailAddress ?? "",
      imageURL: user?.imageUrl ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    });
  }

  //* Get project from database
  const project = await getProjectById(projectId);
  if (!project) redirect("/projects");

  //* Add user to project
  try {
    await addUserToProject(userId!, projectId);
  } catch (error) {
    console.error(
      "Couldn't join project - you might already be a member! 😊",
      error,
    );
  }

  return redirect(`/projects/${projectId}`);
};

export default JoinProject;
