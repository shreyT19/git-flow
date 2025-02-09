"use client";
import React from "react";
import CommitLog from "./_layout/commit-log";
import HeaderActions from "./_layout/header-actions";

const Dashboard = () => {
  return (
    <div>
      <div className="mt-3 flex flex-col gap-6 pb-12">
        <HeaderActions />
        <CommitLog />
      </div>
    </div>
  );
};

export default Dashboard;
