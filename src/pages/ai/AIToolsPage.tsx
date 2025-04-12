
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, AlertCircle, FileText, Send } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

export default function AIToolsPage() {
  const [activeToolIndex, setActiveToolIndex] = useState<number | null>(null);
  const [aiMessage, setAiMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  
  // Sample AI assistant response
  const sampleResponse = "To improve your project documentation, consider including these key elements:\n\n1. Clear project objectives and scope\n2. Detailed requirements and specifications\n3. Timeline with milestones and deadlines\n4. Resource allocation and responsibilities\n5. Risk assessment and mitigation strategies\n\nWould you like me to help you generate a documentation template for your project?";

  const tools = [
    {
      title: "Project Generator",
      description: "AI-assisted project creation",
      icon: Sparkles,
      color: "purple",
      placeholder: "Describe your project requirements...",
      action: "Generate Project"
    },
    {
      title: "Risk Analyzer",
      description: "AI risk assessment and mitigation",
      icon: AlertCircle,
      color: "amber",
      placeholder: "Describe your project scenario for risk analysis...",
      action: "Analyze Risks"
    },
    {
      title: "Content Builder",
      description: "AI content generation",
      icon: FileText,
      color: "emerald",
      placeholder: "Describe what content you need...",
      action: "Create Content"
    }
  ];

  const handleToolClick = (index: number) => {
    setActiveToolIndex(index);
    setAiMessage("");
  };

  const simulateAiResponse = () => {
    setLoading(true);
    setTimeout(() => {
      setAiMessage(sampleResponse);
      setLoading(false);
      toast({
        title: `${tools[activeToolIndex!].title} activated`,
        description: "AI has processed your request",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Tools</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, idx) => (
          <Card 
            key={idx} 
            className={`bg-gradient-to-br from-${tool.color}-50 to-${tool.color}-50/50 dark:from-${tool.color}-900/20 dark:to-${tool.color}-900/10 border-${tool.color}-100 dark:border-${tool.color}-800 hover:shadow-md transition-all cursor-pointer ${activeToolIndex === idx ? 'ring-2 ring-offset-2 ring-' + tool.color + '-500' : ''}`}
            onClick={() => handleToolClick(idx)}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <tool.icon className={`h-5 w-5 mr-2 text-${tool.color}-500`} />
                {tool.title}
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Generate {tool.title.toLowerCase()} using AI.</p>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full bg-gradient-to-r from-${tool.color}-600 to-${tool.color}-500 hover:from-${tool.color}-700 hover:to-${tool.color}-600`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToolClick(idx);
                }}
              >
                <tool.icon className="h-4 w-4 mr-2" />
                {tool.action}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {activeToolIndex !== null && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <tools[activeToolIndex].icon className={`h-5 w-5 mr-2 text-${tools[activeToolIndex].color}-500`} />
            {tools[activeToolIndex].title}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Ask our AI assistant questions about project management, get help with documentation, or generate content for your projects.
          </p>
          
          {aiMessage ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 mb-4">
              <p className="text-sm text-muted-foreground mb-4 italic">
                "How can I improve my project documentation?"
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-line">{aiMessage}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 mb-4">
              <Textarea 
                placeholder={tools[activeToolIndex].placeholder}
                className="min-h-[100px] mb-2"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={simulateAiResponse} 
                  disabled={loading}
                  className={`bg-gradient-to-r from-${tools[activeToolIndex].color}-600 to-${tools[activeToolIndex].color}-500 hover:from-${tools[activeToolIndex].color}-700 hover:to-${tools[activeToolIndex].color}-600`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {tools[activeToolIndex].action}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {aiMessage && (
            <div className="mt-4 flex gap-2">
              <Input 
                type="text" 
                placeholder="Ask followup questions..." 
                className="flex-1"
              />
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
