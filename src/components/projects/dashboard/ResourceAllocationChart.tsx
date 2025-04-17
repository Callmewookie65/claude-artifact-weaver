
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartPie, FileDown, PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ResourceAllocationChartProps {
  resourceData: any[];
  COLORS: string[];
  exportChartDataCSV: (chartType: string) => void;
}

export const ResourceAllocationChart: React.FC<ResourceAllocationChartProps> = ({ 
  resourceData, 
  COLORS, 
  exportChartDataCSV
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow md:col-span-2 bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg dark:bg-black/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">Resource Allocation</CardTitle>
          <CardDescription>
            <span className="flex items-center">
              <span className="text-sm text-muted-foreground">Team distribution by department</span>
              <Button variant="link" size="sm" className="p-0 h-auto ml-1">
                <a href="#" className="inline-flex items-center text-xs">
                  <PencilIcon className="h-3 w-3 mr-1" />
                  Edit
                </a>
              </Button>
            </span>
          </CardDescription>
        </div>
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            onClick={() => exportChartDataCSV('resource')}
          >
            <FileDown className="h-4 w-4" />
            <span className="sr-only">Export data</span>
          </Button>
          <ChartPie className="h-4 w-4 text-muted-foreground" />
        </div>
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
  );
};
