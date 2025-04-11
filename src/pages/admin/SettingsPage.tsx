
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Shield, Bell, Lock, Paintbrush } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Paintbrush className="h-4 w-4" />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a8 8 0 0 0-8 8v12l6.45-3.11a8 8 0 0 1 3.55-.89 8 8 0 0 1 3.55.89L24 22V10a8 8 0 0 0-8-8Z" />
              <circle cx="12" cy="8" r="2" />
              <path d="M12 10v4" />
              <path d="M12 18h.01" />
            </svg>
            <span className="hidden md:inline">AI Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>Update your organization details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organization-name">Organization Name</Label>
                  <Input id="organization-name" defaultValue="Digital Uprising" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization-email">Organization Email</Label>
                  <Input id="organization-email" defaultValue="contact@digitaluprising.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization-address">Address</Label>
                <Input id="organization-address" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organization-city">City</Label>
                  <Input id="organization-city" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization-state">State</Label>
                  <Input id="organization-state" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization-zip">Postal Code</Label>
                  <Input id="organization-zip" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Date & Time</CardTitle>
              <CardDescription>Configure how dates and times are displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Europe/Warsaw">Europe/Warsaw (GMT+2)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (GMT-4)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (GMT-7)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <select
                  id="date-format"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security options for your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="mfa">Multi-Factor Authentication</Label>
                  <p className="text-muted-foreground text-xs">Require MFA for all users</p>
                </div>
                <Switch id="mfa" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="password-expiry">Password Expiry</Label>
                  <p className="text-muted-foreground text-xs">Force password change every 90 days</p>
                </div>
                <Switch id="password-expiry" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sso">Single Sign-On</Label>
                  <p className="text-muted-foreground text-xs">Enable SSO with Google, Microsoft, etc.</p>
                </div>
                <Switch id="sso" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button>Save Security Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                API Keys
              </CardTitle>
              <CardDescription>Manage API keys for external integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Production Key</p>
                    <p className="text-sm text-muted-foreground">Created on May 12, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">Regenerate</Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Development Key</p>
                    <p className="text-sm text-muted-foreground">Created on May 5, 2025</p>
                  </div>
                  <Button variant="outline" size="sm">Regenerate</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Create New API Key
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the appearance of your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="block mb-2">Color Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="border rounded-md p-2 cursor-pointer flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                      <span className="text-sm">Blue</span>
                    </div>
                    <div className="border rounded-md p-2 cursor-pointer flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                      <span className="text-sm">Purple</span>
                    </div>
                    <div className="border rounded-md p-2 cursor-pointer flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-green-600"></div>
                      <span className="text-sm">Green</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-view">Compact View</Label>
                    <p className="text-xs text-muted-foreground">Reduce spacing between elements</p>
                  </div>
                  <Switch id="compact-view" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <Separator />
                
                <div>
                  <Label className="block mb-2">Email Notification Types</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Project updates</span>
                      <Switch id="project-updates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Task assignments</span>
                      <Switch id="task-assignments" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Risk alerts</span>
                      <Switch id="risk-alerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Team mentions</span>
                      <Switch id="team-mentions" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Browser Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive updates in your browser</p>
                  </div>
                  <Switch id="browser-notifications" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Reset</Button>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Settings</CardTitle>
              <CardDescription>Configure AI models and capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ai-model" className="block mb-1">Default AI Model</Label>
                  <select
                    id="ai-model"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5">GPT-3.5</option>
                    <option value="claude-v2">Claude V2</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>AI Content Generation</Label>
                    <p className="text-xs text-muted-foreground">Allow AI to generate content for projects</p>
                  </div>
                  <Switch id="ai-content" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Risk Analysis</Label>
                    <p className="text-xs text-muted-foreground">Use AI to analyze potential project risks</p>
                  </div>
                  <Switch id="ai-risk" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>AI Project Suggestions</Label>
                    <p className="text-xs text-muted-foreground">Get AI recommendations for improving projects</p>
                  </div>
                  <Switch id="ai-suggestions" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Reset</Button>
              <Button>Save AI Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Configure external AI API connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input id="openai-key" type="password" placeholder="Enter your OpenAI API key" value="••••••••••••••••••••••" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="anthropic-key">Anthropic API Key (Optional)</Label>
                <Input id="anthropic-key" type="password" placeholder="Enter your Anthropic API key" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save API Keys</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
