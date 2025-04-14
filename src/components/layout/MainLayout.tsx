
import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Sparkles,
  Link as LinkIcon,
  Settings,
  Users,
  Bell,
  Search,
  Home,
  DollarSign,
  UserSquare,
  Menu
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

export default function MainLayout() {
  const location = useLocation();
  const [notifications] = useState(3); // Example notification count
  
  const mainNavigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
    { name: 'Budgets', href: '/budgets', icon: DollarSign },
    { name: 'Resources', href: '/resources', icon: UserSquare },
    { name: 'Documentation', href: '/documentation', icon: FileText },
    { name: 'AI Tools', href: '/ai-tools', icon: Sparkles },
    { name: 'Integrations', href: '/integrations', icon: LinkIcon },
  ];
  
  const adminNavigation = [
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        <Sidebar className="bg-white border-r border-[#eee]">
          <SidebarHeader className="flex flex-col gap-3 px-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <span className="font-heading font-bold text-xl bg-gradient-custom">
                  ProjectHub
                </span>
              </Link>
              <SidebarTrigger>
                <Menu className="h-5 w-5 text-black" />
              </SidebarTrigger>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-[#f5f5f5] border-[#eee] hover:bg-[#f0f0f0]">
                <Search className="mr-2 h-4 w-4" />
                <span>Search</span>
              </Button>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            {/* Main Navigation */}
            <SidebarMenu>
              {mainNavigation.map((item) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.name}
                      className={`${isActive ? 'bg-[#f5f5f5] text-black font-medium' : 'text-[#555] hover:bg-[#f5f5f5] hover:text-black'}`}
                      asChild
                    >
                      <Link to={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
            
            {/* Admin Section */}
            <div className="px-3 my-4">
              <h3 className="text-xs font-semibold text-[#888] mb-2 px-2">Administration</h3>
              <SidebarMenu>
                {adminNavigation.map((item) => {
                  const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
                  return (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.name}
                        className={`${isActive ? 'bg-[#f5f5f5] text-black font-medium' : 'text-[#555] hover:bg-[#f5f5f5] hover:text-black'}`}
                        asChild
                      >
                        <Link to={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-[#eee] px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-[#f5f5f5] text-black">JK</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Jan Kowalski</span>
                  <span className="text-xs text-[#777]">Project Manager</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="text-[#555] hover:text-black hover:bg-[#f5f5f5]">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center bg-black text-white">{notifications}</Badge>
                  )}
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="p-0 bg-[#f0f2f5]">
          <header className="border-b border-[#eee] px-6 py-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-heading font-medium text-black">Project Management System</h1>
                <p className="text-sm text-[#777]">Import, analyze, and manage project data</p>
              </div>
              <div>
                {/* Header actions could go here */}
              </div>
            </div>
          </header>
          <main className="p-6">
            <Outlet />
          </main>
        </SidebarInset>
        
        <Toaster />
        <Sonner />
      </div>
    </SidebarProvider>
  );
}
