import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectData } from './ProjectCSVImport';
import { Pencil, ArrowUpRight, Filter, Clock, ListTodo } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  project: string;
  assignee: { id: string; name: string; avatar: string };
}

interface ProjectTasksProps {
  project: ProjectData;
}

export const ProjectTasks: React.FC<ProjectTasksProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskItem | null>(null);
  const [draggedTask, setDraggedTask] = useState<TaskItem | null>(null);
  
  const tasks: TaskItem[] = [
    {
      id: '1',
      title: 'Przygotowanie makiet',
      description: 'Stworzenie makiet UI dla głównych widoków aplikacji.',
      status: 'todo',
      priority: 'high',
      dueDate: '2025-04-15',
      project: project.name,
      assignee: { id: '2', name: 'Anna Nowak', avatar: 'AN' }
    },
    {
      id: '2',
      title: 'Implementacja frontendu',
      description: 'Implementacja nowego interfejsu zgodnie z makietami.',
      status: 'inProgress',
      priority: 'high',
      dueDate: '2025-04-20',
      project: project.name,
      assignee: { id: '3', name: 'Piotr Wiśniewski', avatar: 'PW' }
    },
    {
      id: '3',
      title: 'Testy użyteczności',
      description: 'Przeprowadzenie testów z użytkownikami.',
      status: 'done',
      priority: 'medium',
      dueDate: '2025-04-10',
      project: project.name,
      assignee: { id: '2', name: 'Anna Nowak', avatar: 'AN' }
    }
  ];
  
  const getTasks = (status: string) => {
    return tasks.filter(task => task.status === status);
  };
  
  const getTaskPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'low':
        return <Badge variant="outline" className="bg-green-500 text-white">Niski</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-500">Średni</Badge>;
      case 'high':
        return <Badge variant="destructive">Wysoki</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  const openTaskModal = (task: TaskItem | null = null) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };
  
  const closeTaskModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };
  
  const handleDragStart = (e: React.DragEvent, task: TaskItem) => {
    setDraggedTask(task);
  };
  
  const handleDragEnd = () => {
    setDraggedTask(null);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, status: 'todo' | 'inProgress' | 'done') => {
    e.preventDefault();
    console.log(`Task ${draggedTask?.id} moved to ${status}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Project Tasks</h2>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
            <Button variant="link" className="p-0 h-auto ml-2" asChild>
              <a href="#" className="inline-flex items-center">
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </a>
            </Button>
          </p>
        </div>
        <Button onClick={() => openTaskModal()}>
          <ListTodo className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'todo')}
          className="space-y-2"
        >
          <h2 className="font-semibold flex items-center">
            <span className="mr-2">To Do</span>
            <Badge variant="outline" className="bg-gray-200 text-gray-800">
              {getTasks('todo').length}
            </Badge>
          </h2>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[400px]">
            {getTasks('todo').map(task => (
              <Card
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                onDragEnd={handleDragEnd}
                onClick={() => openTaskModal(task)}
                className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{task.title}</h3>
                    {getTaskPriorityBadge(task.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{task.description}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString('pl-PL')}
                    </div>
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                      {task.assignee.avatar}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {getTasks('todo').length === 0 && (
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg border-muted">
                <p className="text-muted-foreground">No tasks</p>
              </div>
            )}
          </div>
        </div>
        
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'inProgress')}
          className="space-y-2"
        >
          <h2 className="font-semibold flex items-center">
            <span className="mr-2">In Progress</span>
            <Badge variant="outline" className="bg-gray-200 text-gray-800">
              {getTasks('inProgress').length}
            </Badge>
          </h2>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[400px]">
            {getTasks('inProgress').map(task => (
              <Card
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                onDragEnd={handleDragEnd}
                onClick={() => openTaskModal(task)}
                className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{task.title}</h3>
                    {getTaskPriorityBadge(task.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{task.description}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString('pl-PL')}
                    </div>
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                      {task.assignee.avatar}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {getTasks('inProgress').length === 0 && (
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg border-muted">
                <p className="text-muted-foreground">No tasks</p>
              </div>
            )}
          </div>
        </div>
        
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'done')}
          className="space-y-2"
        >
          <h2 className="font-semibold flex items-center">
            <span className="mr-2">Done</span>
            <Badge variant="outline" className="bg-gray-200 text-gray-800">
              {getTasks('done').length}
            </Badge>
          </h2>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[400px]">
            {getTasks('done').map(task => (
              <Card
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                onDragEnd={handleDragEnd}
                onClick={() => openTaskModal(task)}
                className="mb-3 cursor-pointer hover:shadow-md transition-shadow opacity-80"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{task.title}</h3>
                    {getTaskPriorityBadge(task.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{task.description}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString('pl-PL')}
                    </div>
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                      {task.assignee.avatar}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {getTasks('done').length === 0 && (
              <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg border-muted">
                <p className="text-muted-foreground">No tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks Overview</CardTitle>
          <CardDescription>Task status distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">To Do</span>
                <span>{getTasks('todo').length} / {tasks.length}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${(getTasks('todo').length / tasks.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">In Progress</span>
                <span>{getTasks('inProgress').length} / {tasks.length}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(getTasks('inProgress').length / tasks.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Done</span>
                <span>{getTasks('done').length} / {tasks.length}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(getTasks('done').length / tasks.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="ml-auto">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            View All Tasks
          </Button>
        </CardFooter>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>{currentTask ? 'Edit Task' : 'Add Task'}</CardTitle>
              <CardDescription>
                {currentTask ? 'Edit task details' : 'Create a new task'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Task form would go here</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={closeTaskModal}>Cancel</Button>
              <Button>{currentTask ? 'Update' : 'Create'}</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};
