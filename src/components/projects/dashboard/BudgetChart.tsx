
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartBar, FileDown, PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface BudgetChartProps {
  budgetData: any[];
  exportChartDataCSV: (chartType: string) => void;
}

export const BudgetChart: React.FC<BudgetChartProps> = ({ budgetData, exportChartDataCSV }) => {
  return (
    <Card className="hover:shadow-md transition-shadow bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg dark:bg-black/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">Budget Overview</CardTitle>
          <CardDescription>
            <span className="flex items-center">
              <span className="text-sm text-muted-foreground">Financial data</span>
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
            onClick={() => exportChartDataCSV('budget')}
          >
            <FileDown className="h-4 w-4" />
            <span className="sr-only">Export data</span>
          </Button>
          <ChartBar className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer 
          config={{
            planned: { label: "Planned Budget", theme: { light: "#8884d8", dark: "#8884d8" } },
            actual: { label: "Actual Spent", theme: { light: "#82ca9d", dark: "#82ca9d" } }
          }}
        >
          <BarChart
            data={budgetData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" tick={{ fill: '#888' }} />
            <YAxis tick={{ fill: '#888' }} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`${value.toLocaleString()} PLN`]}
            />
            <Legend />
            <Bar dataKey="planned" fill="var(--color-planned, #8884d8)" name="Planned" />
            <Bar dataKey="actual" fill="var(--color-actual, #82ca9d)" name="Actual" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
