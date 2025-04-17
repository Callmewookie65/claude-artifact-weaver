
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ProjectData } from '@/types/project';
import { toast } from '@/hooks/use-toast';

export const useProjectDashboard = (project: ProjectData) => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  
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

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
  
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
  
  // Export chart data as CSV
  const exportChartDataCSV = (chartType: string) => {
    let data: any[] = [];
    let filename = "";
    let headers = "";
    
    switch (chartType) {
      case 'budget':
        data = budgetData;
        filename = `${project.name}-budget-data-${new Date().toISOString().split('T')[0]}.csv`;
        headers = "quarter,planned,actual\n";
        break;
      case 'progress':
        data = progressData;
        filename = `${project.name}-progress-data-${new Date().toISOString().split('T')[0]}.csv`;
        headers = "month,progress\n";
        break;
      case 'resource':
        data = resourceData;
        filename = `${project.name}-resource-data-${new Date().toISOString().split('T')[0]}.csv`;
        headers = "name,value\n";
        break;
      default:
        toast({
          title: "Export failed",
          description: "Unknown chart type",
          variant: "destructive",
        });
        return;
    }
    
    // Convert data to CSV rows
    const rows = data.map(item => {
      return Object.values(item).join(',');
    }).join('\n');
    
    const csvContent = `${headers}${rows}`;
    
    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Data exported",
      description: `Chart data has been exported to ${filename}`,
    });
  };

  return {
    dashboardRef,
    budgetData,
    progressData,
    resourceData,
    COLORS,
    calculateRemainingDays,
    exportToPDF,
    exportToPNG,
    exportChartDataCSV
  };
};
