
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Link2, Calendar, FileText, CheckCircle2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Integrations</h1>
        <Button variant="outline">
          <Link2 className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Connect Digital Uprising Platform with your favorite tools and services.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.251 11.82a3.117 3.117 0 0 0-2.328-3.067L22.911 0H8.104L11.1 8.753a3.116 3.116 0 0 0-2.244 2.993c0 1.711 1.388 3.106 3.106 3.106.824 0 1.558-.326 2.108-.853l3.1 5.446 3.811-.761-.958-4.8a3.153 3.153 0 0 0 2.228-3.064z" />
                    <path d="M7.365 22.147a3.117 3.117 0 0 0 2.328 3.066l-2.987 8.753h14.805l-2.993-8.753a3.114 3.114 0 0 0 2.241-2.992c0-1.71-1.387-3.106-3.103-3.106-.825 0-1.56.326-2.109.854l-3.102-5.446-3.809.762.957 4.8a3.14 3.14 0 0 0-2.228 3.063z" />
                  </svg>
                </div>
                <div>
                  <CardTitle>Jira Software</CardTitle>
                  <CardDescription>Task and issue tracking</CardDescription>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm">Connected to Acme Corp Jira</span>
              </div>
              <Switch id="jira-sync" defaultChecked />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">Configure</Button>
            <Button variant="ghost" size="sm" className="text-red-600">
              <X className="h-4 w-4 mr-1" />
              Disconnect
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.372 0 0 5.373 0 12c0 5.302 3.438 9.8 8.206 11.387.6.11.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.084-.729.084-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.806 1.304 3.487.997.107-.776.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.524.118-3.176 0 0 1.008-.323 3.3 1.23.956-.266 1.98-.399 3-.405 1.02.006 2.046.139 3 .405 2.29-1.553 3.296-1.23 3.296-1.23.655 1.652.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.806 5.624-5.478 5.921.43.372.814 1.103.814 2.223v3.293c0 .32.22.694.825.576C20.566 21.797 24 17.3 24 12c0-6.628-5.373-12-12-12"/>
                  </svg>
                </div>
                <div>
                  <CardTitle>GitHub</CardTitle>
                  <CardDescription>Version control integration</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-muted-foreground">Not Connected</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect with GitHub to link repositories to your projects and track development progress.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Connect GitHub</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Google Calendar</CardTitle>
                  <CardDescription>Calendar integration</CardDescription>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Connected</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-events" className="flex items-center space-x-2">
                  <span>Sync project deadlines</span>
                </Label>
                <Switch id="sync-events" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sync-meetings" className="flex items-center space-x-2">
                  <span>Sync team meetings</span>
                </Label>
                <Switch id="sync-meetings" defaultChecked />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">Configure</Button>
            <Button variant="ghost" size="sm" className="text-red-600">
              <X className="h-4 w-4 mr-1" />
              Disconnect
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <CardTitle>Google Drive</CardTitle>
                  <CardDescription>File storage and sharing</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-muted-foreground">Not Connected</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Connect with Google Drive to store project files, share documents, and collaborate on content.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Connect Google Drive</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
