"use client";
import React from "react";
import CommitLog from "./_layout/commit-log";
import HeaderActions from "./_layout/header-actions";
import QuestionCard from "./_layout/question-card";
import MeetingCard from "./_layout/meeting-card";

const Dashboard = () => {
  return (
    <div>
      <div className="mt-3 flex flex-col gap-6 pb-12">
        <HeaderActions />
        <div className="grid grid-cols-5 gap-6">
          <QuestionCard />
          <MeetingCard />
        </div>
        <CommitLog />
      </div>
    </div>
  );
};

export default Dashboard;
