
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const DashboardDeadlines: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nadchodzące terminy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex-1">
              <p className="font-medium">Przegląd projektu - Redesign Strony Głównej</p>
              <p className="text-sm text-muted-foreground">Spotkanie z klientem w celu omówienia postępów prac.</p>
            </div>
            <div className="text-right">
              <p className="font-medium">13.04.2025</p>
              <p className="text-sm text-muted-foreground">Za 2 dni</p>
            </div>
          </div>
          
          <div className="flex items-center border-l-4 border-red-500 pl-4 py-2">
            <div className="flex-1">
              <p className="font-medium">Deadline MVP - Aplikacja Mobilna</p>
              <p className="text-sm text-muted-foreground">Termin dostarczenia pierwszej wersji aplikacji.</p>
            </div>
            <div className="text-right">
              <p className="font-medium">16.04.2025</p>
              <p className="text-sm text-muted-foreground">Za 5 dni</p>
            </div>
          </div>
          
          <div className="flex items-center border-l-4 border-yellow-500 pl-4 py-2">
            <div className="flex-1">
              <p className="font-medium">Migracja danych - System CRM</p>
              <p className="text-sm text-muted-foreground">Przeniesienie danych klienta do nowego systemu.</p>
            </div>
            <div className="text-right">
              <p className="font-medium">20.04.2025</p>
              <p className="text-sm text-muted-foreground">Za 9 dni</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          Zobacz wszystkie terminy
        </Button>
      </CardFooter>
    </Card>
  );
};
