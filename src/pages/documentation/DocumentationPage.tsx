
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Video, HelpCircle, Code, Plus } from 'lucide-react';

export default function DocumentationPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Documentation</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </div>

      <Tabs defaultValue="guides">
        <TabsList>
          <TabsTrigger value="guides">
            <FileText className="h-4 w-4 mr-2" />
            Guides
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="h-4 w-4 mr-2" />
            Video Tutorials
          </TabsTrigger>
          <TabsTrigger value="faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="api">
            <Code className="h-4 w-4 mr-2" />
            API Reference
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="guides" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Basic guide for new users</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Learn how to create your first project and navigate the platform.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Read Guide</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
                <CardDescription>Full project management workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Learn how to manage projects from start to finish efficiently.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Read Guide</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Using AI Tools</CardTitle>
                <CardDescription>AI assistance for project management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Learn how to leverage AI tools to speed up project creation and management.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Read Guide</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="videos" className="mt-6">
          <p>Video tutorials section will be implemented here.</p>
        </TabsContent>
        
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">How do I create a new project?</h3>
                <p className="text-sm text-muted-foreground">
                  Navigate to the Projects section and click on "New Project" button. Fill out the required information in the form and click "Create."
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">How can I invite team members?</h3>
                <p className="text-sm text-muted-foreground">
                  Go to the project details page, navigate to the Team tab, and click on "Add Member" to invite new team members by email.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">How do I track project progress?</h3>
                <p className="text-sm text-muted-foreground">
                  The project details page shows progress metrics and analytics. You can also view the dashboard for an overview of all projects.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
          <p>API Reference section will be implemented here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
