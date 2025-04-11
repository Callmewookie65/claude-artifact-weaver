
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Shield, Bell, Lock, Paintbrush } from 'lucide-react';
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  // Organization settings
  const [orgSettings, setOrgSettings] = useState({
    name: "Digital Uprising",
    email: "contact@digitaluprising.com",
    address: "123 Tech Street",
    city: "Warsaw",
    state: "Mazovia",
    zipCode: "00-001"
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    mfa: false,
    passwordExpiry: false,
    sso: true
  });
  
  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    colorTheme: "blue",
    darkMode: theme === "dark",
    compactView: false
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    projectUpdates: true,
    taskAssignments: true,
    riskAlerts: true,
    teamMentions: true,
    browser: true
  });
  
  // AI settings
  const [aiSettings, setAiSettings] = useState({
    defaultModel: "gpt-4",
    contentGeneration: true,
    riskAnalysis: true,
    projectSuggestions: true,
    openAiKey: "••••••••••••••••••••••",
    anthropicKey: ""
  });

  // Handle organization settings update
  const handleOrgSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Organization settings updated",
      description: "Your organization information has been saved."
    });
  };

  // Handle security settings update
  const handleSecurityUpdate = () => {
    toast({
      title: "Security settings updated",
      description: "Your security preferences have been saved."
    });
  };

  // Handle appearance settings update
  const handleAppearanceUpdate = () => {
    // Update theme based on settings
    setTheme(appearanceSettings.darkMode ? "dark" : "light");
    
    toast({
      title: "Appearance settings updated",
      description: "Your appearance preferences have been saved."
    });
  };

  // Handle notification settings update
  const handleNotificationUpdate = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been saved."
    });
  };

  // Handle AI settings update
  const handleAISettingsUpdate = () => {
    toast({
      title: "AI settings updated",
      description: "Your AI settings have been saved."
    });
  };

  // Handle API keys update
  const handleAPIKeysUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "API keys updated",
      description: "Your API configuration has been saved."
    });
  };

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
            <form onSubmit={handleOrgSettingsUpdate}>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>Update your organization details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization-name">Organization Name</Label>
                    <Input 
                      id="organization-name" 
                      value={orgSettings.name}
                      onChange={(e) => setOrgSettings({...orgSettings, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization-email">Organization Email</Label>
                    <Input 
                      id="organization-email" 
                      value={orgSettings.email}
                      onChange={(e) => setOrgSettings({...orgSettings, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="organization-address">Address</Label>
                  <Input 
                    id="organization-address" 
                    value={orgSettings.address}
                    onChange={(e) => setOrgSettings({...orgSettings, address: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organization-city">City</Label>
                    <Input 
                      id="organization-city" 
                      value={orgSettings.city}
                      onChange={(e) => setOrgSettings({...orgSettings, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization-state">State</Label>
                    <Input 
                      id="organization-state" 
                      value={orgSettings.state}
                      onChange={(e) => setOrgSettings({...orgSettings, state: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization-zip">Postal Code</Label>
                    <Input 
                      id="organization-zip" 
                      value={orgSettings.zipCode}
                      onChange={(e) => setOrgSettings({...orgSettings, zipCode: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" type="button">Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
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
                <Switch 
                  id="mfa" 
                  checked={securitySettings.mfa}
                  onCheckedChange={(checked) => {
                    setSecuritySettings({...securitySettings, mfa: checked});
                  }}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="password-expiry">Password Expiry</Label>
                  <p className="text-muted-foreground text-xs">Force password change every 90 days</p>
                </div>
                <Switch 
                  id="password-expiry" 
                  checked={securitySettings.passwordExpiry}
                  onCheckedChange={(checked) => {
                    setSecuritySettings({...securitySettings, passwordExpiry: checked});
                  }}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sso">Single Sign-On</Label>
                  <p className="text-muted-foreground text-xs">Enable SSO with Google, Microsoft, etc.</p>
                </div>
                <Switch 
                  id="sso" 
                  defaultChecked 
                  checked={securitySettings.sso}
                  onCheckedChange={(checked) => {
                    setSecuritySettings({...securitySettings, sso: checked});
                  }}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button onClick={handleSecurityUpdate}>Save Security Settings</Button>
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
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Regenerate API Key</SheetTitle>
                        <SheetDescription>
                          Are you sure you want to regenerate this API key? All applications using this key will need to be updated.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <p>This action cannot be undone. The old key will immediately become invalid.</p>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline">Cancel</Button>
                          <Button 
                            onClick={() => {
                              toast({
                                title: "API key regenerated",
                                description: "Your new API key has been generated successfully."
                              });
                            }}
                          >
                            Confirm
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">Development Key</p>
                    <p className="text-sm text-muted-foreground">Created on May 5, 2025</p>
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Regenerate Development API Key</SheetTitle>
                        <SheetDescription>
                          Are you sure you want to regenerate this development API key?
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <p>This action cannot be undone. The old key will immediately become invalid.</p>
                        <div className="flex justify-end gap-3">
                          <Button variant="outline">Cancel</Button>
                          <Button 
                            onClick={() => {
                              toast({
                                title: "Development API key regenerated",
                                description: "Your new development API key has been generated successfully."
                              });
                            }}
                          >
                            Confirm
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "New API key created",
                    description: "Your new API key has been created successfully."
                  });
                }}
              >
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
                    <div 
                      className={`border rounded-md p-2 cursor-pointer flex items-center space-x-2 ${
                        appearanceSettings.colorTheme === "blue" ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setAppearanceSettings({...appearanceSettings, colorTheme: "blue"})}
                    >
                      <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                      <span className="text-sm">Blue</span>
                    </div>
                    <div 
                      className={`border rounded-md p-2 cursor-pointer flex items-center space-x-2 ${
                        appearanceSettings.colorTheme === "purple" ? "ring-2 ring-purple-500" : ""
                      }`}
                      onClick={() => setAppearanceSettings({...appearanceSettings, colorTheme: "purple"})}
                    >
                      <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                      <span className="text-sm">Purple</span>
                    </div>
                    <div 
                      className={`border rounded-md p-2 cursor-pointer flex items-center space-x-2 ${
                        appearanceSettings.colorTheme === "green" ? "ring-2 ring-green-500" : ""
                      }`}
                      onClick={() => setAppearanceSettings({...appearanceSettings, colorTheme: "green"})}
                    >
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
                  <Switch 
                    id="dark-mode"
                    checked={appearanceSettings.darkMode}
                    onCheckedChange={(checked) => {
                      setAppearanceSettings({...appearanceSettings, darkMode: checked});
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-view">Compact View</Label>
                    <p className="text-xs text-muted-foreground">Reduce spacing between elements</p>
                  </div>
                  <Switch 
                    id="compact-view"
                    checked={appearanceSettings.compactView}
                    onCheckedChange={(checked) => {
                      setAppearanceSettings({...appearanceSettings, compactView: checked});
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setAppearanceSettings({
                    colorTheme: "blue",
                    darkMode: false,
                    compactView: false
                  });
                  setTheme("light");
                }}
              >
                Reset to Defaults
              </Button>
              <Button onClick={handleAppearanceUpdate}>Save Changes</Button>
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
                  <Switch 
                    id="email-notifications" 
                    defaultChecked 
                    checked={notificationSettings.email}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, email: checked});
                    }}
                  />
                </div>
                
                <Separator />
                
                <div>
                  <Label className="block mb-2">Email Notification Types</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Project updates</span>
                      <Switch 
                        id="project-updates" 
                        defaultChecked 
                        checked={notificationSettings.projectUpdates}
                        onCheckedChange={(checked) => {
                          setNotificationSettings({...notificationSettings, projectUpdates: checked});
                        }}
                        disabled={!notificationSettings.email}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Task assignments</span>
                      <Switch 
                        id="task-assignments" 
                        defaultChecked 
                        checked={notificationSettings.taskAssignments}
                        onCheckedChange={(checked) => {
                          setNotificationSettings({...notificationSettings, taskAssignments: checked});
                        }}
                        disabled={!notificationSettings.email}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Risk alerts</span>
                      <Switch 
                        id="risk-alerts" 
                        defaultChecked 
                        checked={notificationSettings.riskAlerts}
                        onCheckedChange={(checked) => {
                          setNotificationSettings({...notificationSettings, riskAlerts: checked});
                        }}
                        disabled={!notificationSettings.email}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Team mentions</span>
                      <Switch 
                        id="team-mentions" 
                        defaultChecked 
                        checked={notificationSettings.teamMentions}
                        onCheckedChange={(checked) => {
                          setNotificationSettings({...notificationSettings, teamMentions: checked});
                        }}
                        disabled={!notificationSettings.email}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Browser Notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive updates in your browser</p>
                  </div>
                  <Switch 
                    id="browser-notifications" 
                    defaultChecked 
                    checked={notificationSettings.browser}
                    onCheckedChange={(checked) => {
                      setNotificationSettings({...notificationSettings, browser: checked});
                      if (checked && Notification.permission !== 'granted') {
                        Notification.requestPermission();
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setNotificationSettings({
                    email: true,
                    projectUpdates: true,
                    taskAssignments: true,
                    riskAlerts: true,
                    teamMentions: true,
                    browser: true
                  });
                }}
              >
                Reset
              </Button>
              <Button onClick={handleNotificationUpdate}>Save Preferences</Button>
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
                    value={aiSettings.defaultModel}
                    onChange={(e) => setAiSettings({...aiSettings, defaultModel: e.target.value})}
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
                  <Switch 
                    id="ai-content" 
                    defaultChecked 
                    checked={aiSettings.contentGeneration}
                    onCheckedChange={(checked) => {
                      setAiSettings({...aiSettings, contentGeneration: checked});
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Risk Analysis</Label>
                    <p className="text-xs text-muted-foreground">Use AI to analyze potential project risks</p>
                  </div>
                  <Switch 
                    id="ai-risk" 
                    defaultChecked 
                    checked={aiSettings.riskAnalysis}
                    onCheckedChange={(checked) => {
                      setAiSettings({...aiSettings, riskAnalysis: checked});
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>AI Project Suggestions</Label>
                    <p className="text-xs text-muted-foreground">Get AI recommendations for improving projects</p>
                  </div>
                  <Switch 
                    id="ai-suggestions" 
                    defaultChecked 
                    checked={aiSettings.projectSuggestions}
                    onCheckedChange={(checked) => {
                      setAiSettings({...aiSettings, projectSuggestions: checked});
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setAiSettings({
                    ...aiSettings,
                    contentGeneration: true,
                    riskAnalysis: true,
                    projectSuggestions: true
                  });
                }}
              >
                Reset
              </Button>
              <Button onClick={handleAISettingsUpdate}>Save AI Settings</Button>
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
                <Input 
                  id="openai-key" 
                  type="password" 
                  placeholder="Enter your OpenAI API key" 
                  value={aiSettings.openAiKey}
                  onChange={(e) => setAiSettings({...aiSettings, openAiKey: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="anthropic-key">Anthropic API Key (Optional)</Label>
                <Input 
                  id="anthropic-key" 
                  type="password" 
                  placeholder="Enter your Anthropic API key"
                  value={aiSettings.anthropicKey}
                  onChange={(e) => setAiSettings({...aiSettings, anthropicKey: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleAPIKeysUpdate}>Save API Keys</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
