
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database, X, FileCheck } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';

interface ConfluenceImportProps {
  onImport: (data: any) => void;
  onCancel: () => void;
}

export const ConfluenceImport: React.FC<ConfluenceImportProps> = ({ onImport, onCancel }) => {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a Confluence URL",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Simulate fetching data from Confluence with a progress indicator
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Mock Confluence data response
      const mockConfluenceData = {
        title: "Project Documentation",
        description: "This project was imported from Confluence. It includes detailed specifications for the website redesign, focusing on improving the user experience and implementing modern UI standards. The redesign aims to increase conversion rates by 15% and improve mobile engagement.",
        pageId: "12345",
        spaceKey: "PROJ",
        lastUpdated: new Date().toISOString(),
        attachments: [
          { id: "att1", name: "requirements.pdf", size: "2.4 MB" },
          { id: "att2", name: "wireframes.png", size: "850 KB" }
        ],
        creator: {
          name: "Anna Nowak",
          email: "anna@example.com"
        }
      };
      
      // Success notification
      toast({
        title: "Data Retrieved",
        description: "Successfully fetched data from Confluence",
      });
      
      // Pass the data to the parent component
      onImport(mockConfluenceData);
      
    } catch (error) {
      console.error("Error importing from Confluence", error);
      toast({
        title: "Error",
        description: "Failed to import data from Confluence",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-100 shadow-md">
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-blue-600 mr-2" />
            <CardTitle className="text-lg">Import from Confluence</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="url">Confluence Page URL</Label>
              <Input
                id="url"
                placeholder="https://your-domain.atlassian.net/wiki/spaces/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key (optional)</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Confluence API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                If left empty, you'll be prompted to authenticate via Atlassian
              </p>
            </div>
            
            {loading && (
              <div className="space-y-2 my-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Importing data...</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-5 pb-5 px-6 bg-gray-50 dark:bg-gray-900/10">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Importing...
            </>
          ) : (
            <>
              <FileCheck className="h-4 w-4 mr-2" />
              Import Data
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
