
import React, { useEffect, useState } from 'react';
import { generateBudgetTemplate } from '@/utils/csvExport';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Edit, PlusCircle } from 'lucide-react';

interface Budget {
  id: string;
  projectId: string;
  projectName: string;
  total: number;
  used: number;
  remaining: number;
  percentageSpent: number;
  currency: string;
  category?: string;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  useEffect(() => {
    // Try to load budgets from localStorage
    const importedData = localStorage.getItem('importedData');
    if (importedData) {
      try {
        const parsed = JSON.parse(importedData);
        if (parsed.budgets && Array.isArray(parsed.budgets)) {
          const processedBudgets = parsed.budgets.map((budget: any, index: number) => ({
            id: budget.id || budget.ProjectID || `budget-${index}`,
            projectId: budget.ProjectID || budget.projectId || `proj-${index}`,
            projectName: budget.Project || budget.project || budget.projectName || "Unnamed Project",
            total: parseFloat(budget.Budget || budget.budget || budget.total || 0),
            used: parseFloat(budget.Spent || budget.spent || budget.used || 0),
            remaining: parseFloat(budget.Remaining || budget.remaining || 0),
            percentageSpent: parseFloat(budget['Percentage spent'] || budget.percentageSpent || 0),
            currency: budget.Currency || budget.currency || 'PLN',
            category: budget.Category || budget.category || 'General'
          }));
          
          setBudgets(processedBudgets);
        }
      } catch (error) {
        console.error("Failed to parse imported budget data:", error);
      }
    } else {
      // Set some sample data if nothing was imported
      setBudgets([
        {
          id: 'budget-1',
          projectId: '101',
          projectName: 'Redesign Strony Głównej',
          total: 50000,
          used: 25000,
          remaining: 25000,
          percentageSpent: 50,
          currency: 'PLN',
          category: 'Development'
        },
        {
          id: 'budget-2',
          projectId: '102',
          projectName: 'Aplikacja Mobilna',
          total: 100000,
          used: 12000,
          remaining: 88000,
          percentageSpent: 12,
          currency: 'PLN',
          category: 'Design'
        },
        {
          id: 'budget-3',
          projectId: '103',
          projectName: 'System CRM',
          total: 90000,
          used: 88000,
          remaining: 2000,
          percentageSpent: 98,
          currency: 'PLN',
          category: 'Infrastructure'
        }
      ]);
    }
  }, []);

  // Handle budget value change
  const handleBudgetChange = (id: string, field: keyof Budget, value: any) => {
    setBudgets(prev => 
      prev.map(budget => {
        if (budget.id === id) {
          const updatedBudget = { ...budget, [field]: value };
          
          // Recalculate related fields
          if (field === 'total' || field === 'used') {
            const total = field === 'total' ? value : budget.total;
            const used = field === 'used' ? value : budget.used;
            updatedBudget.remaining = total - used;
            updatedBudget.percentageSpent = total > 0 ? Math.round((used / total) * 100) : 0;
          }
          
          return updatedBudget;
        }
        return budget;
      })
    );
  };

  // Get total budget statistics
  const getTotals = () => {
    return budgets.reduce((acc, budget) => {
      return {
        total: acc.total + budget.total,
        used: acc.used + budget.used,
        remaining: acc.remaining + budget.remaining
      };
    }, { total: 0, used: 0, remaining: 0 });
  };

  const totals = getTotals();
  const totalPercentage = totals.total > 0 ? Math.round((totals.used / totals.total) * 100) : 0;

  // Function to format currency
  const formatCurrency = (amount: number, currency: string = 'PLN') => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-coral via-terracotta to-gold bg-clip-text text-transparent mb-2">
            Budgets
          </h1>
          <p className="text-[#999]">Manage and track project budgets</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={generateBudgetTemplate} className="border-[#333] bg-[#111] hover:bg-[#1A1A1A] hover:border-coral">
            <Download className="mr-2 h-5 w-5" />
            Template
          </Button>
          <Button className="btn-primary">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Budget
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-new">
          <h3 className="text-xl font-heading text-coral mb-2">Total Budget</h3>
          <p className="text-2xl font-bold">{formatCurrency(totals.total)}</p>
          <p className="text-[#999] text-sm">Across all projects</p>
        </div>
        <div className="card-new">
          <h3 className="text-xl font-heading text-terracotta mb-2">Used</h3>
          <p className="text-2xl font-bold">{formatCurrency(totals.used)} <span className="text-[#999] text-sm">({totalPercentage}%)</span></p>
          <div className="w-full bg-[#222] rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                totalPercentage > 90 ? 'bg-red-500' : 
                totalPercentage > 75 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`} 
              style={{ width: `${totalPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="card-new">
          <h3 className="text-xl font-heading text-gold mb-2">Remaining</h3>
          <p className="text-2xl font-bold">{formatCurrency(totals.remaining)}</p>
          <p className="text-[#999] text-sm">Available funds</p>
        </div>
      </div>

      <div className="card-new overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading">Budget Details</h2>
          <Button variant="ghost" onClick={() => setIsEditing(isEditing ? null : 'all')} className="text-[#999] hover:text-coral">
            <Edit className="mr-2 h-4 w-4" />
            {isEditing ? 'Done Editing' : 'Edit All'}
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#111] border-b border-[#222]">
                <TableHead className="text-[#999]">Project</TableHead>
                <TableHead className="text-[#999]">Category</TableHead>
                <TableHead className="text-[#999] text-right">Total</TableHead>
                <TableHead className="text-[#999] text-right">Used</TableHead>
                <TableHead className="text-[#999] text-right">Remaining</TableHead>
                <TableHead className="text-[#999] text-right">%</TableHead>
                <TableHead className="text-[#999]">Currency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map((budget) => (
                <TableRow 
                  key={budget.id}
                  className="border-b border-[#222] hover:bg-[#111]"
                >
                  <TableCell className="font-medium">{budget.projectName}</TableCell>
                  <TableCell>
                    {isEditing ? (
                      <input
                        type="text"
                        value={budget.category}
                        onChange={(e) => handleBudgetChange(budget.id, 'category', e.target.value)}
                        className="input-new py-1 px-2 text-sm"
                      />
                    ) : (
                      budget.category
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={budget.total}
                        onChange={(e) => handleBudgetChange(budget.id, 'total', parseFloat(e.target.value) || 0)}
                        className="input-new py-1 px-2 text-sm w-28 text-right"
                      />
                    ) : (
                      formatCurrency(budget.total, budget.currency)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={budget.used}
                        onChange={(e) => handleBudgetChange(budget.id, 'used', parseFloat(e.target.value) || 0)}
                        className="input-new py-1 px-2 text-sm w-28 text-right"
                      />
                    ) : (
                      formatCurrency(budget.used, budget.currency)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(budget.remaining, budget.currency)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        budget.percentageSpent > 90 ? 'bg-red-500/20 text-red-500' : 
                        budget.percentageSpent > 75 ? 'bg-yellow-500/20 text-yellow-500' : 
                        'bg-green-500/20 text-green-500'
                      }`}
                    >
                      {budget.percentageSpent}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <input
                        type="text"
                        value={budget.currency}
                        onChange={(e) => handleBudgetChange(budget.id, 'currency', e.target.value)}
                        className="input-new py-1 px-2 text-sm w-16"
                      />
                    ) : (
                      budget.currency
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#222]">
          <div className="text-sm text-[#999]">
            Showing {budgets.length} budget entries
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium">Total: <span className="text-coral">{formatCurrency(totals.total)}</span></p>
            <p className="text-sm text-[#999]">
              Used: {formatCurrency(totals.used)} ({totalPercentage}%) • 
              Remaining: {formatCurrency(totals.remaining)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
