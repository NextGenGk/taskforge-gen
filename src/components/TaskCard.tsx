
import { Task } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
};

const statusColors = {
  pending: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  in_progress: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
};

const categoryColors = {
  marketing: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  finance: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  operations: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  legal: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  sales: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  customer_service: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
  human_resources: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  technology: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  administration: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  strategy: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
};

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onStatusChange?: (task: Task) => void;
}

const TaskCard = ({ task, onClick, onStatusChange }: TaskCardProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: 'pending' | 'in_progress' | 'completed') => {
    if (task.status === newStatus) return;
    
    setIsUpdating(true);
    try {
      const updatedTask = await api.updateTaskStatus(task.id, newStatus);
      
      if (updatedTask) {
        toast({
          title: "Task updated",
          description: `Task "${task.title}" has been moved to ${newStatus.replace('_', ' ')}.`,
        });
        
        if (onStatusChange) {
          onStatusChange(updatedTask);
        }
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card 
      className={cn(
        "task-card card-hover overflow-hidden border transition-all duration-300 animate-fade-in",
        task.status === "completed" && "opacity-75"
      )}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2 mb-1">
          <Badge className={cn("font-medium", statusColors[task.status])}>
            {task.status.replace("_", " ")}
          </Badge>
          <Badge className={cn("font-medium", priorityColors[task.priority])}>
            {task.priority}
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold leading-tight">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {task.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex flex-col items-stretch gap-2">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No due date"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{task.frequency}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          <Badge variant="outline" className={cn("text-xs", categoryColors[task.category])}>
            {task.category.replace("_", " ")}
          </Badge>
          {task.tags.slice(0, 2).map((tag, i) => (
            <Badge variant="outline" key={i} className="text-xs">
              {tag}
            </Badge>
          ))}
          {task.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{task.tags.length - 2}
            </Badge>
          )}
        </div>
        
        {/* Task action buttons */}
        <div className="flex justify-between gap-2 mt-3 pt-2 border-t">
          {task.status !== 'in_progress' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs h-8"
              disabled={isUpdating || task.status === 'completed'}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange('in_progress');
              }}
            >
              Start
            </Button>
          )}
          
          {task.status !== 'completed' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs h-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
              disabled={isUpdating}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange('completed');
              }}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Complete
            </Button>
          )}
          
          {task.status === 'completed' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs h-8"
              disabled={isUpdating}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange('pending');
              }}
            >
              Reopen
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
