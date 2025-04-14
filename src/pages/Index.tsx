
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, BarChart, ListChecks, UserSquare } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">PM Dashboard</h1>
          <p className="text-[#777]">Project Management System</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/dashboard" className="no-underline">
            <Card className="hover:shadow-md transition-shadow rounded-xl border-0">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5" /> Dashboard
                </CardTitle>
                <CardDescription>Main panel</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#777]">Overview of all projects and statistics.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/projects" className="no-underline">
            <Card className="hover:shadow-md transition-shadow rounded-xl border-0">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5" /> Projects
                </CardTitle>
                <CardDescription>Project management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#777]">Project overview, statuses, budgets.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/tasks" className="no-underline">
            <Card className="hover:shadow-md transition-shadow rounded-xl border-0">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <ListChecks className="mr-2 h-5 w-5" /> Tasks
                </CardTitle>
                <CardDescription>Task management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#777]">Assigning and tracking tasks.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/risks" className="no-underline">
            <Card className="hover:shadow-md transition-shadow rounded-xl border-0">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" /> Risks
                </CardTitle>
                <CardDescription>Risk management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#777]">Risk identification and mitigation.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/team" className="no-underline">
            <Card className="hover:shadow-md transition-shadow rounded-xl border-0">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <UserSquare className="mr-2 h-5 w-5" /> Team
                </CardTitle>
                <CardDescription>Team management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#777]">Team members and assignments.</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" asChild className="bg-white hover:bg-[#f5f5f5] border-[#eee]">
              <Link to="/risks" className="w-full flex items-center justify-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Risk Management
              </Link>
            </Button>
            <Button variant="outline" asChild className="bg-white hover:bg-[#f5f5f5] border-[#eee]">
              <Link to="/dashboard" className="w-full flex items-center justify-center gap-2">
                <BarChart className="h-5 w-5" /> Project Dashboard
              </Link>
            </Button>
            <Button variant="outline" disabled className="bg-white border-[#eee]">
              <span className="flex items-center justify-center gap-2">
                <ListChecks className="h-5 w-5" /> Add New Task
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
