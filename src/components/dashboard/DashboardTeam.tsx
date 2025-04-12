
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users } from 'lucide-react';

export const DashboardTeam: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Zespół projektowy</CardTitle>
        <Button size="sm">
          <Users className="h-4 w-4 mr-2" />
          Dodaj osobę
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg flex items-center space-x-3 dark:border-gray-700">
            <Avatar className="h-12 w-12">
              <AvatarFallback>JK</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Jan Kowalski</p>
              <p className="text-sm text-muted-foreground">Project Manager</p>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg flex items-center space-x-3 dark:border-gray-700">
            <Avatar className="h-12 w-12">
              <AvatarFallback>AN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Anna Nowak</p>
              <p className="text-sm text-muted-foreground">Designer</p>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg flex items-center space-x-3 dark:border-gray-700">
            <Avatar className="h-12 w-12">
              <AvatarFallback>PW</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Piotr Wiśniewski</p>
              <p className="text-sm text-muted-foreground">Developer</p>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg flex items-center space-x-3 dark:border-gray-700">
            <Avatar className="h-12 w-12">
              <AvatarFallback>ML</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Marta Lewandowska</p>
              <p className="text-sm text-muted-foreground">Content Manager</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
