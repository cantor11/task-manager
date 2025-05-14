import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task } from '@shared/schema';
import { useTaskStore } from '@/stores/taskStore';
import { useReminderStore } from '@/stores/reminderStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

// Task form schema
const taskSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  date: z.string().min(1, 'La fecha es requerida'),
  time: z.string().min(1, 'La hora es requerida'),
  priority: z.enum(['alta', 'media', 'baja']),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const TaskModal = ({ isOpen, onClose, task }: TaskModalProps) => {
  const { addTask, updateTask } = useTaskStore();
  const { addReminder } = useReminderStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      priority: 'media',
    },
  });

  // Update form when editing a task or opening modal
  useEffect(() => {
    if (task) {
      const dueDate = new Date(task.dueDate);
      form.reset({
        title: task.title,
        description: task.description || '',
        date: dueDate.toISOString().split('T')[0],
        time: dueDate.toTimeString().slice(0, 5),
        priority: task.priority as 'alta' | 'media' | 'baja',
      });
    } else {
      // Reset form to default values when creating a new task
      form.reset({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        priority: 'media',
      });
    }
  }, [task, form, isOpen]);

  const onSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Combine date and time into a single Date object
      const dueDate = new Date(`${values.date}T${values.time}`);
      
      if (task) {
        // Update existing task
        await updateTask({
          ...task,
          title: values.title,
          // description puede ser undefined, pero en la db es string o null
          description: values.description === undefined ? "" : values.description,
          dueDate,
          priority: values.priority,
          // El estado se mantiene igual que el anterior
        });
        toast({
          title: 'Tarea actualizada',
          description: 'La tarea ha sido actualizada correctamente',
        });
      } else {
        // Create new task
        const newTask = await addTask({
          title: values.title,
          // description puede ser undefined, pero en la db es string o null
          description: values.description === undefined ? "" : values.description,
          dueDate,
          priority: values.priority,
          status: 'pendiente', // Siempre pendiente para nuevas tareas
          flagged: false,
        });
        
        // Crear un recordatorio desactivado automáticamente para la nueva tarea
        if (newTask) {
          try {
            await addReminder({
              taskId: newTask.id,
              minutesBefore: 30,
              enabled: false
            });
          } catch (err) {
            console.error('Error al crear recordatorio automático:', err);
          }
        }
        
        toast({
          title: 'Tarea creada',
          description: 'La tarea ha sido creada correctamente',
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al guardar la tarea',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? 'Editar Tarea' : 'Agregar Tarea'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título de la tarea" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción de la tarea" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridad</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la prioridad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            

            <DialogFooter className="mt-6 gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
