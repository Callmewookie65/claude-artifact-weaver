
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Calendar, User } from 'lucide-react';
import { ProjectData } from '@/types/project';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inProgress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: string;
}

interface ProjectTasksProps {
  project: ProjectData;
}

export const ProjectTasks: React.FC<ProjectTasksProps> = ({ project }) => {
  // Sample tasks for the project
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design mockups',
      description: 'Create UI mockups for the main project views',
      status: 'done',
      priority: 'high',
      dueDate: '2025-03-15',
      assignee: project.team && project.team.length > 0 ? project.team[0].name : 'Unassigned'
    },
    {
      id: '2',
      title: 'Implement frontend',
      description: 'Develop the new interface based on the approved mockups',
      status: 'inProgress',
      priority: 'high',
      dueDate: '2025-04-20',
      assignee: project.team && project.team.length > 1 ? project.team[1].name : 'Unassigned'
    }
  ]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    assignee: '',
  });
  
  // Open task modal for editing or creating
  const openTaskModal = (task: Task | null = null) => {
    if (task) {
      setCurrentTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignee: task.assignee
      });
    } else {
      setCurrentTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        assignee: project.team && project.team.length > 0 ? project.team[0].name : 'Unassigned'
      });
    }
    setIsModalOpen(true);
  };
  
  // Handle form changes
  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!formData.title) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    
    if (currentTask) {
      // Update existing task
      const updatedTask = {
        ...currentTask,
        ...formData
      } as Task;
      
      setTasks(tasks.map(task => task.id === currentTask.id ? updatedTask : task));
      toast({
        title: "Task Updated",
        description: "Task has been updated successfully"
      });
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        title: formData.title || '',
        description: formData.description || '',
        status: formData.status as 'todo' | 'inProgress' | 'done',
        priority: formData.priority as 'low' | 'medium' | 'high',
        dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
        assignee: formData.assignee || 'Unassigned'
      };
      
      setTasks([...tasks, newTask]);
      toast({
        title: "Task Created",
        description: "New task has been created successfully"
      });
    }
    
    setIsModalOpen(false);
  };
  
  // Delete task
  const handleDelete = () => {
    if (currentTask) {
      setTasks(tasks.filter(task => task.id !== currentTask.id));
      toast({
        title: "Task Deleted",
        description: "Task has been deleted successfully",
        variant: "destructive"
      });
      setIsModalOpen(false);
    }
  };
  
  // Filter tasks by status
  const getTasks = (status: 'todo' | 'inProgress' | 'done') => {
    return tasks.filter(task => task.status === status);
  };
  
  // Task priority badge
  const getTaskPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'low':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Low</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Medium</span>;
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">High</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{priority}</span>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Project tasks and assignments</CardDescription>
          </div>
          <Button onClick={() => openTaskModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To Do Column */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center">
                <span className="mr-2">To Do</span>
                <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {getTasks('todo').length}
                </span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
                {getTasks('todo').map(task => (
                  <div
                    key={task.id}
                    onClick={() => openTaskModal(task)}
                    className="p-4 mb-3 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{task.title}</h3>
                      {getTaskPriorityBadge(task.priority)}
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{task.description}</p>
                    <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {task.assignee}
                      </div>
                    </div>
                  </div>
                ))}
                {getTasks('todo').length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No tasks</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* In Progress Column */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center">
                <span className="mr-2">In Progress</span>
                <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {getTasks('inProgress').length}
                </span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
                {getTasks('inProgress').map(task => (
                  <div
                    key={task.id}
                    onClick={() => openTaskModal(task)}
                    className="p-4 mb-3 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{task.title}</h3>
                      {getTaskPriorityBadge(task.priority)}
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{task.description}</p>
                    <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {task.assignee}
                      </div>
                    </div>
                  </div>
                ))}
                {getTasks('inProgress').length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No tasks</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Done Column */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center">
                <span className="mr-2">Done</span>
                <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {getTasks('done').length}
                </span>
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
                {getTasks('done').map(task => (
                  <div
                    key={task.id}
                    onClick={() => openTaskModal(task)}
                    className="p-4 mb-3 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{task.title}</h3>
                      {getTaskPriorityBadge(task.priority)}
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{task.description}</p>
                    <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {task.assignee}
                      </div>
                    </div>
                  </div>
                ))}
                {getTasks('done').length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Task Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Title</Label>
              <Input
                id="task-title"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Task title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Task description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleChange('priority', value)}
                >
                  <SelectTrigger id="task-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="task-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger id="task-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="task-assignee">Assignee</Label>
                <Select
                  value={formData.assignee || ''}
                  onValueChange={(value) => handleChange('assignee', value)}
                >
                  <SelectTrigger id="task-assignee">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {project.team && project.team.map(member => (
                      <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                    ))}
                    {(!project.team || project.team.length === 0) && (
                      <SelectItem value="Unassigned">Unassigned</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center">
            <div>
              {currentTask && (
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {currentTask ? 'Update Task' : 'Add Task'}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
