
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Edit, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function UsersPage() {
  // Sample users data
  const users = [
    {
      id: 1,
      name: 'Jan Kowalski',
      email: 'jan.kowalski@example.com',
      role: 'Admin',
      avatar: 'JK',
      status: 'active'
    },
    {
      id: 2,
      name: 'Anna Nowak',
      email: 'anna.nowak@example.com',
      role: 'Project Manager',
      avatar: 'AN',
      status: 'active'
    },
    {
      id: 3,
      name: 'Piotr Wiśniewski',
      email: 'piotr.wisniewski@example.com',
      role: 'Developer',
      avatar: 'PW',
      status: 'active'
    },
    {
      id: 4,
      name: 'Marta Lewandowska',
      email: 'marta.lewandowska@example.com',
      role: 'Designer',
      avatar: 'ML',
      status: 'inactive'
    }
  ];

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Function to get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Badge className="bg-purple-100 text-purple-800">{role}</Badge>;
      case 'Project Manager':
        return <Badge className="bg-blue-100 text-blue-800">{role}</Badge>;
      case 'Developer':
        return <Badge className="bg-emerald-100 text-emerald-800">{role}</Badge>;
      case 'Designer':
        return <Badge className="bg-amber-100 text-amber-800">{role}</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">User</th>
                  <th scope="col" className="px-6 py-3">Role</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Disable Account</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Badge className="bg-purple-100 text-purple-800 mr-2">Admin</Badge>
                  <span>Administrator</span>
                </div>
                <span className="text-sm">1</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Badge className="bg-blue-100 text-blue-800 mr-2">PM</Badge>
                  <span>Project Manager</span>
                </div>
                <span className="text-sm">1</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Badge className="bg-emerald-100 text-emerald-800 mr-2">Dev</Badge>
                  <span>Developer</span>
                </div>
                <span className="text-sm">1</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Badge className="bg-amber-100 text-amber-800 mr-2">Design</Badge>
                  <span>Designer</span>
                </div>
                <span className="text-sm">1</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">JK</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm">Jan Kowalski <span className="text-muted-foreground">updated permissions for</span> Anna Nowak</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">AN</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm">Anna Nowak <span className="text-muted-foreground">joined the platform</span></p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inactive Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.filter(user => user.status === 'inactive').map(user => (
                <div key={user.id} className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Activate</Button>
                </div>
              ))}
              {users.filter(user => user.status === 'inactive').length === 0 && (
                <p className="text-sm text-muted-foreground">No inactive users found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
