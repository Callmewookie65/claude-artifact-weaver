
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/projects/ProjectsPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import RisksPage from './pages/RisksPage';
import BudgetsPage from './pages/BudgetsPage';
import ResourcesPage from './pages/ResourcesPage';
import AIToolsPage from './pages/ai/AIToolsPage';
import DocumentationPage from './pages/documentation/DocumentationPage';
import IntegrationsPage from './pages/integrations/IntegrationsPage';
import SettingsPage from './pages/admin/SettingsPage';
import UsersPage from './pages/admin/UsersPage';
import NotFound from './pages/NotFound';
import { ProjectsProvider } from '@/components/providers/ProjectsProvider';

function App() {
  return (
    <ProjectsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="risks" element={<RisksPage />} />
            <Route path="budgets" element={<BudgetsPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="ai-tools" element={<AIToolsPage />} />
            <Route path="documentation" element={<DocumentationPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="admin/settings" element={<SettingsPage />} />
            <Route path="admin/users" element={<UsersPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ProjectsProvider>
  );
}

export default App;
