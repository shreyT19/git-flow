"use server";
import { upsertUser } from "@/actions/user/repository";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

const SyncUser = async () => {
  const { userId } = await auth();

  if (!userId) throw new Error("User not found");

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    return notFound();
  }

  await upsertUser({
    emailAddress: user.emailAddresses[0]?.emailAddress ?? "",
    imageURL: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
    id: userId,
  });

  return redirect("/dashboard");
};

export default SyncUser;
