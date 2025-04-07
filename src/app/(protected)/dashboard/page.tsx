"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  GitBranch,
  Users,
  Clock,
  CheckCircle2,
  Plus,
  CreditCard,
  BarChart,
} from "lucide-react";
import { api } from "@/trpc/react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import EmptyPlaceHolder from "@/components/global/Layouts/empty-placeholder";

export default function DashboardPage() {
  const router = useRouter();

  // Fetch data from API
  const { data: projects = [] } = api.project.getProjects.useQuery();
  const { data: teamMembers = [] } = api.project.getTeamMembers.useQuery({
    projectId: projects[0]?.id ?? "",
  });
  const { data: userCredits = 0 } = api.project.getUserCredits.useQuery();
  const { data: questions = [] } = api.project.getQuestionsByUserId.useQuery();
  const { data: meetings = [] } =
    api.project.getMeetingsUserHasAccessTo.useQuery();

  // Calculate metrics
  const totalProjects = projects.length;
  const activeUsers = teamMembers.length;
  const successRate =
    questions.length > 0
      ? (questions.filter((q) => q.status === "completed").length /
          questions.length) *
        100
      : 0;
  const recentActivities = [
    ...meetings.map((m) => ({
      type: "meeting",
      title: m.project.name,
      date: m.createdAt,
      status: m.status,
    })),
    ...questions.map((q) => ({
      type: "question",
      title: q.question,
      date: q.createdAt,
      status: q.status,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Extract credits value properly
  const creditsValue =
    typeof userCredits === "object" && userCredits !== null
      ? userCredits.credits
      : typeof userCredits === "number"
        ? userCredits
        : 0;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => router.push("/projects/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>
                <GitBranch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProjects}</div>
                <p className="text-xs text-muted-foreground">Active projects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Active team members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Credits
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{creditsValue}</div>
                <p className="text-xs text-muted-foreground">
                  Remaining credits
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[350px]">
                  <div className="space-y-8">
                    {recentActivities.map((activity, i) => (
                      <div key={i} className="flex items-center">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {activity.type === "meeting" ? "M" : "Q"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {activity.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.date), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          <Badge
                            variant={
                              activity.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {meetings
                    .filter((m) => m.status === "scheduled")
                    .slice(0, 2)
                    .map((meeting) => (
                      <div key={meeting.id} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {meeting.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(meeting.scheduledAt),
                              { addSuffix: true },
                            )}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <Badge variant="secondary">Scheduled</Badge>
                        </div>
                      </div>
                    ))}

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Project Progress
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Overall completion
                        </p>
                      </div>
                      <div className="ml-auto text-sm font-medium">
                        {successRate.toFixed(0)}%
                      </div>
                    </div>
                    <Progress value={successRate} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <EmptyPlaceHolder
            text="Coming soon"
            visible={true}
            icon={"externalLink"}
          />
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <EmptyPlaceHolder
            text="Coming soon"
            visible={true}
            icon={"externalLink"}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
