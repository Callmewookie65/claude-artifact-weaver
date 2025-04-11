
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RisksPage from "./pages/RisksPage";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./components/layout/MainLayout";

// Placeholder pages - will be implemented later
import ProjectsPage from "./pages/projects/ProjectsPage";
import ProjectDetailPage from "./pages/projects/ProjectDetailPage";
import DocumentationPage from "./pages/documentation/DocumentationPage";
import AIToolsPage from "./pages/ai/AIToolsPage";
import IntegrationsPage from "./pages/integrations/IntegrationsPage";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            
            {/* Protected routes with layout */}
            <Route path="/" element={<MainLayout><Navigate to="/dashboard" replace /></MainLayout>} />
            <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
            
            {/* Project routes */}
            <Route path="/projects" element={<MainLayout><ProjectsPage /></MainLayout>} />
            <Route path="/projects/:id" element={<MainLayout><ProjectDetailPage /></MainLayout>} />
            
            {/* Risk management */}
            <Route path="/projects/:id/risks" element={<MainLayout><RisksPage /></MainLayout>} />
            <Route path="/risks" element={<MainLayout><RisksPage /></MainLayout>} />
            
            {/* Documentation routes */}
            <Route path="/documentation" element={<MainLayout><DocumentationPage /></MainLayout>} />
            
            {/* AI Tools routes */}
            <Route path="/ai-tools" element={<MainLayout><AIToolsPage /></MainLayout>} />
            
            {/* Integration routes */}
            <Route path="/integrations" element={<MainLayout><IntegrationsPage /></MainLayout>} />
            
            {/* Admin routes */}
            <Route path="/admin/users" element={<MainLayout><UsersPage /></MainLayout>} />
            <Route path="/admin/settings" element={<MainLayout><SettingsPage /></MainLayout>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
