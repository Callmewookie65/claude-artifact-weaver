
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  
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
      <div className="min-h-screen flex w-full bg-white text-black">
        <Sidebar className="bg-white border-r border-gray-200">
          <SidebarHeader className="flex flex-col gap-3 px-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <span className="font-heading font-bold text-xl text-black">
                  ProjectHub
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-gray-100 border-gray-200 hover:bg-gray-200">
                <Search className="mr-2 h-4 w-4" />
                <span>Search</span>
              </Button>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              {mainNavigation.map((item) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.name}>
                    <Link 
                      to={item.href} 
                      className={`flex items-center space-x-2 p-2 rounded ${
                        isActive 
                          ? 'bg-black text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
            
            <div className="px-3 my-4">
              <h3 className="text-xs font-semibold text-gray-500 mb-2 px-2">Administration</h3>
              <SidebarMenu>
                {adminNavigation.map((item) => {
                  const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
                  return (
                    <SidebarMenuItem key={item.name}>
                      <Link 
                        to={item.href} 
                        className={`flex items-center space-x-2 p-2 rounded ${
                          isActive 
                            ? 'bg-black text-white' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-gray-200 text-black">JK</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Jan Kowalski</span>
                  <span className="text-xs text-gray-500">Project Manager</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
