import { SignIn } from "@clerk/nextjs";
import React from "react";

const Page = () => {
  return (
    <div className="flex h-full min-h-screen items-center justify-center">
      <SignIn />;
    </div>
  );
};

export default Page;
