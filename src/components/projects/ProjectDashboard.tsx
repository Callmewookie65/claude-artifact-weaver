
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Download, Printer, ChartBar, ChartPie } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ProjectData } from './ProjectCSVImport';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ProjectDashboardProps {
  project: ProjectData;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ project }) => {
  const dashboardRef = React.useRef<HTMLDivElement>(null);
  
  // Sample data for charts based on the project
  const budgetData = [
    { name: 'Q1', planned: project.budget?.total ? project.budget.total * 0.25 : 0, actual: project.budget?.used ? project.budget.used * 0.4 : 0 },
    { name: 'Q2', planned: project.budget?.total ? project.budget.total * 0.50 : 0, actual: project.budget?.used ? project.budget.used * 0.7 : 0 },
    { name: 'Q3', planned: project.budget?.total ? project.budget.total * 0.75 : 0, actual: project.budget?.used || 0 },
    { name: 'Q4', planned: project.budget?.total || 0, actual: 0 }
  ];
  
  const progressData = [
    { month: 'Jan', progress: 10 },
    { month: 'Feb', progress: 25 },
    { month: 'Mar', progress: 40 },
    { month: 'Apr', progress: project.progress || 45 }
  ];

  const resourceData = [
    { name: 'Development', value: 45 },
    { name: 'Design', value: 25 },
    { name: 'Testing', value: 15 },
    { name: 'Management', value: 15 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Calculate remaining days
  const calculateRemainingDays = () => {
    if (!project.endDate) return "N/A";
    
    const today = new Date();
    const endDate = new Date(project.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    
    return diffDays > 0 ? `${diffDays} days` : "Overdue";
  };
  
  // Export to PDF
  const exportToPDF = async () => {
    if (!dashboardRef.current) return;
    
    try {
      toast({
        title: "Exporting dashboard",
        description: "Preparing your PDF, please wait...",
      });
      
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${project.name}-dashboard-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Export complete",
        description: "Your dashboard has been exported as PDF",
      });
    } catch (error) {
      console.error("Failed to export dashboard", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your dashboard",
        variant: "destructive",
      });
    }
  };
  
  // Export to PNG
  const exportToPNG = async () => {
    if (!dashboardRef.current) return;
    
    try {
      toast({
        title: "Exporting dashboard",
        description: "Preparing your PNG, please wait...",
      });
      
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `${project.name}-dashboard-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: "Export complete",
        description: "Your dashboard has been exported as PNG",
      });
    } catch (error) {
      console.error("Failed to export dashboard", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your dashboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold">Project Dashboard</h2>
        <div className="flex space-x-2">
          <Button onClick={exportToPNG} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PNG
          </Button>
          <Button onClick={exportToPDF} variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>
      
      <div ref={dashboardRef} className="space-y-6 p-4 bg-background rounded-lg">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Budget Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {project.budget ? 
                  `${Math.round((project.budget.used / project.budget.total) * 100)}%` : 
                  'N/A'}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {project.budget ? 
                  `${project.budget.used.toLocaleString()} / ${project.budget.total.toLocaleString()} PLN` : 
                  'No budget data'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Project Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {project.progress || 0}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {project.status === 'active' ? 'In Progress' : 
                 project.status === 'completed' ? 'Completed' :
                 project.status === 'onHold' ? 'On Hold' : 
                 project.status === 'atRisk' ? 'At Risk' : project.status}
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Time Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {calculateRemainingDays()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {project.endDate ? 
                  `Due: ${new Date(project.endDate).toLocaleDateString()}` : 
                  'No end date set'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget Chart */}
          <Card className="hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Budget Overview</CardTitle>
              <ChartBar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer 
                config={{
                  planned: { label: "Planned Budget" },
                  actual: { label: "Actual Spent" }
                }}
              >
                <BarChart
                  data={budgetData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [`${value.toLocaleString()} PLN`]}
                  />
                  <Legend />
                  <Bar dataKey="planned" fill="#8884d8" name="Planned" />
                  <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          {/* Progress Timeline */}
          <Card className="hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Progress Timeline</CardTitle>
              <ChartBar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer 
                config={{
                  progress: { label: "Progress %" }
                }}
              >
                <LineChart
                  data={progressData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value: number) => [`${value}%`]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="progress" stroke="#8884d8" activeDot={{ r: 8 }} name="Progress" />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          {/* Resource Allocation */}
          <Card className="hover:shadow-md transition-shadow md:col-span-2 dark:border-gray-700 dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Resource Allocation</CardTitle>
              <ChartPie className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer 
                config={{
                  resource: { label: "Resources" }
                }}
              >
                <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <Pie
                    data={resourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {resourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                  />
                  <Legend />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Project Risk Details */}
        <Card className="hover:shadow-md transition-shadow dark:border-gray-700 dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Project Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  project.riskLevel === 'high' ? 'bg-red-400' :
                  project.riskLevel === 'medium' ? 'bg-yellow-400' :
                  'bg-green-400'
                }`}></div>
                <div>
                  <p className="font-medium">Overall Risk Level</p>
                  <p className="text-sm text-muted-foreground">
                    {project.riskLevel === 'high' ? 'High Risk' :
                     project.riskLevel === 'medium' ? 'Medium Risk' :
                     'Low Risk'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  project.budget && project.budget.used > project.budget.total * 0.9 ? 'bg-red-400' :
                  project.budget && project.budget.used > project.budget.total * 0.7 ? 'bg-yellow-400' :
                  'bg-green-400'
                }`}></div>
                <div>
                  <p className="font-medium">Budget Risk</p>
                  <p className="text-sm text-muted-foreground">
                    {project.budget && project.budget.used > project.budget.total * 0.9 ? 'High Risk' :
                     project.budget && project.budget.used > project.budget.total * 0.7 ? 'Medium Risk' :
                     'Low Risk'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
