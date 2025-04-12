
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { ProjectData } from '@/components/projects/ProjectCSVImport';

interface DashboardAnalyticsProps {
  projects: ProjectData[];
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ projects }) => {
  // Project status data for pie chart
  const projectStatusData = [
    { name: 'Aktywne', value: projects.filter(p => p.status === 'active').length },
    { name: 'Zakończone', value: projects.filter(p => p.status === 'completed').length },
    { name: 'Wstrzymane', value: projects.filter(p => p.status === 'onHold').length },
    { name: 'Zagrożone', value: projects.filter(p => p.status === 'atRisk').length },
  ].filter(item => item.value > 0);

  // Budget data for bar chart
  const budgetData = projects
    .filter(p => p.budget?.total)
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      planned: p.budget?.total || 0,
      used: p.budget?.used || 0
    }));

  // Tasks data for pie chart - static sample data
  const tasksData = [
    { name: 'Do zrobienia', value: 12 },
    { name: 'W trakcie', value: 8 },
    { name: 'Ukończone', value: 24 },
  ];

  // Progress trend data - static sample data
  const progressTrendData = [
    { month: 'Sty', value: 20 },
    { month: 'Lut', value: 35 },
    { month: 'Mar', value: 50 },
    { month: 'Kwi', value: 65 },
    { month: 'Maj', value: 82 },
  ];

  // Colors for the charts
  const statusColors = ['#4ade80', '#60a5fa', '#f59e0b', '#f87171'];
  const taskColors = ['#f97316', '#3b82f6', '#22c55e'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Status projektów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wykorzystanie budżetu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={budgetData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip formatter={(value) => `${value.toLocaleString()} PLN`} />
                <Bar dataKey="planned" fill="#8884d8" name="Planowany" />
                <Bar dataKey="used" fill="#82ca9d" name="Wykorzystany" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status zadań</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {tasksData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={taskColors[index % taskColors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trend postępu projektów</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={progressTrendData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Średni postęp" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
