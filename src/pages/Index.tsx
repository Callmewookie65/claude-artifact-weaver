
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, BarChart, ListChecks, UserSquare } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">PM Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">System zarządzania projektami</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/projects" className="no-underline">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2 h-5 w-5" /> Projekty
                </CardTitle>
                <CardDescription>Zarządzanie projektami</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Przegląd projektów, statusy, budżety.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/tasks" className="no-underline">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <ListChecks className="mr-2 h-5 w-5" /> Zadania
                </CardTitle>
                <CardDescription>Zarządzanie zadaniami</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Przydzielanie i śledzenie zadań.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/risks" className="no-underline">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" /> Ryzyka
                </CardTitle>
                <CardDescription>Zarządzanie ryzykiem</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Identyfikacja i minimalizacja ryzyka.</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/team" className="no-underline">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <UserSquare className="mr-2 h-5 w-5" /> Zespół
                </CardTitle>
                <CardDescription>Zarządzanie zespołem</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Członkowie zespołu i przydziały.</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Szybki dostęp</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" asChild>
              <Link to="/risks" className="w-full flex items-center justify-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Zarządzanie ryzykiem
              </Link>
            </Button>
            <Button variant="outline" disabled>
              <span className="flex items-center justify-center gap-2">
                <ListChecks className="h-5 w-5" /> Dodaj nowe zadanie
              </span>
            </Button>
            <Button variant="outline" disabled>
              <span className="flex items-center justify-center gap-2">
                <BarChart className="h-5 w-5" /> Raporty projektowe
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
