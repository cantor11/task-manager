import { useEffect, useState } from 'react';
import { useReminderStore } from '@/stores/reminderStore';
import { useTaskStore } from '@/stores/taskStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: number | null;
}

const ReminderModal = ({ isOpen, onClose, taskId }: ReminderModalProps) => {
  const { reminders, addReminder, updateReminder } = useReminderStore();
  const { tasks } = useTaskStore();
  const { toast } = useToast();
  const [selectedTime, setSelectedTime] = useState('30');
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskId) {
      const reminder = reminders.find(r => r.taskId === taskId);
      if (reminder) {
        setSelectedTime(reminder.minutesBefore.toString());
        setIsEnabled(reminder.enabled || false);
      } else {
        setSelectedTime('30');
        setIsEnabled(true);
      }
    }
  }, [taskId, reminders]);

  const handleSave = async () => {
    if (!taskId) return;
    
    setIsSubmitting(true);
    try {
      const minutesBefore = parseInt(selectedTime, 10);
      const existingReminder = reminders.find(r => r.taskId === taskId);
      
      if (existingReminder) {
        // Update existing reminder
        await updateReminder(taskId, {
          ...existingReminder,
          minutesBefore,
          // Mantener el estado de activación actual
          enabled: existingReminder.enabled
        });
      } else {
        // Create new reminder
        await addReminder({
          taskId,
          minutesBefore,
          // Para nuevos recordatorios, activados por defecto
          enabled: true
        });
      }
      
      const task = tasks.find(t => t.id === taskId);
      toast({
        title: 'Recordatorio guardado',
        description: `Recordatorio configurado a ${minutesBefore} minutos antes para "${task?.title || 'la tarea'}"`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al guardar el recordatorio',
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
          <DialogTitle>Configurar recordatorio</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reminder-time">Minutos antes</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="reminder-time"
                type="number" 
                value={selectedTime} 
                onChange={(e) => setSelectedTime(e.target.value)}
                min="1" 
                max="1440"
                className="w-24"
              />
              <span className="text-sm text-gray-500">minutos</span>
            </div>
            <p className="text-xs text-gray-500">Recibirás una notificación antes de la hora programada</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderModal;
