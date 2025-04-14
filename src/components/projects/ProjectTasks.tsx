
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectData } from './ProjectCSVImport';
import { Pencil, ArrowUpRight, Clock, ListTodo, Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Define a TaskItem interface to use throughout the component
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

type DbTask = Tables<'tasks'>;
type DbTaskInsert = TablesInsert<'tasks'>;
type DbTaskUpdate = TablesUpdate<'tasks'>;

export const ProjectTasks: React.FC<{ project: ProjectData }> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskItem | null>(null);
  const [draggedTask, setDraggedTask] = useState<TaskItem | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [tasks, setTasks] = useState<TaskItem[]>([
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
  ]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await (supabase
          .from('tasks' as any)
          .select('*')
          .eq('project_id', project.id)) as { 
            data: DbTask[] | null, 
            error: any 
          };
          
        if (error) {
          console.error('Error fetching tasks:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // Convert DbTask[] to TaskItem[] with proper type mapping
          const formattedTasks: TaskItem[] = data.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description || '',
            // Ensure status is one of the required literal types
            status: (task.status as 'todo' | 'inProgress' | 'done'),
            // Ensure priority is one of the required literal types
            priority: (task.priority as 'low' | 'medium' | 'high'),
            dueDate: task.due_date || '',
            project: project.name,
            assignee: task.assignee ? JSON.parse(task.assignee) : { 
              id: '1', 
              name: 'Unassigned', 
              avatar: 'UN' 
            }
          }));
          
          setTasks(formattedTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    
    if (project.id) {
      fetchTasks();
    }
  }, [project.id]);
  
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
    
    if (task) {
      setTaskTitle(task.title);
      setTaskDescription(task.description);
      setTaskPriority(task.priority);
      setTaskDueDate(task.dueDate);
    } else {
      setTaskTitle('');
      setTaskDescription('');
      setTaskPriority('medium');
      setTaskDueDate('');
    }
    
    setIsModalOpen(true);
  };
  
  const closeTaskModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
    
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setTaskDueDate('');
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
  
  const handleDrop = async (e: React.DragEvent, status: 'todo' | 'inProgress' | 'done') => {
    e.preventDefault();
    
    if (!draggedTask) return;
    
    const updatedTasks = tasks.map(task => 
      task.id === draggedTask.id ? { ...task, status } : task
    );
    
    setTasks(updatedTasks);
    
    try {
      const { error } = await (supabase
        .from('tasks' as any)
        .update({ status } as DbTaskUpdate)
        .eq('id', draggedTask.id)) as { error: any };
        
      if (error) {
        console.error('Error updating task status:', error);
        toast({
          title: "Error",
          description: "Failed to update task status",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Task moved successfully"
        });
      }
    } catch (error) {
      console.error('Task update error:', error);
    }
  };
  
  const handleSaveTask = async () => {
    if (!taskTitle.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    const taskData: DbTaskInsert = {
      id: currentTask?.id || crypto.randomUUID(),
      title: taskTitle,
      description: taskDescription,
      status: currentTask?.status || 'todo',
      priority: taskPriority,
      due_date: taskDueDate || new Date().toISOString().split('T')[0],
      project_id: project.id,
      assignee: JSON.stringify({ 
        id: '1', 
        name: 'Unassigned', 
        avatar: 'UN' 
      })
    };
    
    try {
      if (currentTask) {
        const { error } = await (supabase
          .from('tasks' as any)
          .update(taskData)
          .eq('id', currentTask.id)) as { error: any };
        
        if (error) {
          console.error('Update error:', error);
          toast({
            title: "Error",
            description: "Failed to update task",
            variant: "destructive"
          });
        } else {
          setTasks(tasks.map(task => 
            task.id === currentTask.id 
              ? { 
                  ...task, 
                  title: taskData.title,
                  description: taskData.description || '',
                  priority: taskData.priority as 'low' | 'medium' | 'high',
                  dueDate: taskData.due_date || ''
                } 
              : task
          ));
        }
      } else {
        const { error } = await (supabase
          .from('tasks' as any)
          .insert(taskData)) as { error: any };
        
        if (error) {
          console.error('Insert error:', error);
          toast({
            title: "Error",
            description: "Failed to create task",
            variant: "destructive"
          });
        } else {
          // Create new task with the correct TaskItem shape
          const newTask: TaskItem = {
            id: taskData.id,
            title: taskData.title,
            description: taskData.description || '',
            status: taskData.status as 'todo' | 'inProgress' | 'done',
            priority: taskData.priority as 'low' | 'medium' | 'high',
            dueDate: taskData.due_date || '',
            project: project.name,
            assignee: { 
              id: '1', 
              name: 'Unassigned', 
              avatar: 'UN' 
            }
          };
          
          setTasks([...tasks, newTask]);
        }
      }
    } catch (error) {
      console.error('Task save error:', error);
    } finally {
      setLoading(false);
      closeTaskModal();
    }
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
        <Button onClick={() => openTaskModal()} className="bg-black text-white hover:bg-gray-800">
          <Plus className="h-4 w-4 mr-2" />
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
                className="mb-3 cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
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
                className="mb-3 cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
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
                className="mb-3 cursor-pointer hover:shadow-md transition-shadow opacity-80 bg-white dark:bg-gray-700"
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{currentTask ? 'Edit Task' : 'Add Task'}</CardTitle>
                <CardDescription>
                  {currentTask ? 'Update task details' : 'Create a new task'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={closeTaskModal}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    id="title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                    placeholder="Task title"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm"
                    rows={3}
                    placeholder="Task description"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                      Due Date
                    </label>
                    <input
                      id="dueDate"
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={closeTaskModal}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveTask} 
                disabled={loading}
                className="bg-black text-white hover:bg-gray-800"
              >
                {loading ? 'Saving...' : currentTask ? 'Update' : 'Create'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProjectTasks;
