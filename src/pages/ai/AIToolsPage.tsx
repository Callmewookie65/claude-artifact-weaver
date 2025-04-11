
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, AlertCircle, FileText } from 'lucide-react';

export default function AIToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Tools</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-100 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
              Project Generator
            </CardTitle>
            <CardDescription>AI-assisted project creation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Generate project templates, timelines, and resource allocations using AI.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Project
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
              Risk Analyzer
            </CardTitle>
            <CardDescription>AI risk assessment and mitigation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Identify potential risks in your project and get AI-generated mitigation strategies.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600">
              <AlertCircle className="h-4 w-4 mr-2" />
              Analyze Risks
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-100 dark:border-emerald-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-emerald-500" />
              Content Builder
            </CardTitle>
            <CardDescription>AI content generation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Generate project documentation, reports, and content using advanced AI.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600">
              <FileText className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
          AI Assistant
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Ask our AI assistant questions about project management, get help with documentation, or generate content for your projects.
        </p>
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
          <p className="text-sm text-muted-foreground mb-4 italic">
            "How can I improve my project documentation?"
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm">
              To improve your project documentation, consider including these key elements:
              
              <ol className="list-decimal ml-5 mt-2 space-y-1">
                <li>Clear project objectives and scope</li>
                <li>Detailed requirements and specifications</li>
                <li>Timeline with milestones and deadlines</li>
                <li>Resource allocation and responsibilities</li>
                <li>Risk assessment and mitigation strategies</li>
              </ol>
              
              Would you like me to help you generate a documentation template for your project?
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <input 
            type="text" 
            placeholder="Ask anything about your projects..." 
            className="flex-1 p-2 rounded-md border"
          />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
}
