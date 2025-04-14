
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectData } from './ProjectCSVImport';
import { Pencil, ArrowUpRight, Clock, ListTodo, Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

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

  // Try to load tasks from Supabase if available
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('project_id', project.id);
          
        if (error) {
          console.error('Error fetching tasks:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // Transform from database format to our TaskItem format
          const formattedTasks: TaskItem[] = data.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.due_date,
            project: project.name,
            assignee: task.assignee ? JSON.parse(task.assignee) : { id: '1', name: 'Unassigned', avatar: 'UN' }
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
    
    if (!draggedTask) return;
    
    // Update task status in UI
    const updatedTasks = tasks.map(task => 
      task.id === draggedTask.id ? { ...task, status } : task
    );
    
    setTasks(updatedTasks);
    
    // Save to Supabase if available
    const saveTaskStatus = async () => {
      try {
        const { error } = await supabase
          .from('tasks')
          .update({ status })
          .eq('id', draggedTask.id);
          
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
        console.log('Task updated in UI only');
      }
    };
    
    saveTaskStatus();
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
    
    const newTask: TaskItem = {
      id: currentTask?.id || String(Date.now()),
      title: taskTitle,
      description: taskDescription,
      status: currentTask?.status || 'todo',
      priority: taskPriority,
      dueDate: taskDueDate || new Date().toISOString().split('T')[0],
      project: project.name,
      assignee: currentTask?.assignee || { id: '1', name: 'Unassigned', avatar: 'UN' }
    };
    
    // Save to Supabase if available
    try {
      const taskData = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        due_date: newTask.dueDate,
        project_id: project.id,
        assignee: JSON.stringify(newTask.assignee)
      };
      
      let error;
      
      if (currentTask) {
        // Update existing task
        const result = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', newTask.id);
          
        error = result.error;
        
        if (!error) {
          setTasks(tasks.map(task => 
            task.id === newTask.id ? newTask : task
          ));
        }
      } else {
        // Create new task
        const result = await supabase
          .from('tasks')
          .insert([taskData]);
          
        error = result.error;
        
        if (!error) {
          setTasks([...tasks, newTask]);
        }
      }
      
      if (error) {
        console.error('Error saving task:', error);
        // Save to local state anyway
        if (currentTask) {
          setTasks(tasks.map(task => 
            task.id === newTask.id ? newTask : task
          ));
        } else {
          setTasks([...tasks, newTask]);
        }
      }
    } catch (error) {
      console.log('Task saved to local state only');
      // Save to local state
      if (currentTask) {
        setTasks(tasks.map(task => 
          task.id === newTask.id ? newTask : task
        ));
      } else {
        setTasks([...tasks, newTask]);
      }
    }
    
    setLoading(false);
    closeTaskModal();
    
    toast({
      title: currentTask ? "Task Updated" : "Task Created",
      description: `${newTask.title} has been ${currentTask ? "updated" : "added"} successfully`
    });
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
