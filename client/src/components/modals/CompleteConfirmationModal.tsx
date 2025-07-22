import { useState } from 'react';
import { Task } from '@shared/schema';
import { useTaskStore } from '@/stores/taskStore';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface CompleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const CompleteConfirmationModal = ({ isOpen, onClose, task }: CompleteConfirmationModalProps) => {
  const { updateTask } = useTaskStore();
  const { toast } = useToast();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    if (!task) return;
    
    setIsCompleting(true);
    try {
      await updateTask({
        ...task,
        status: 'completada'
      });
      toast({
        title: 'Tarea completada',
        description: 'La tarea ha sido marcada como completada',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al completar la tarea',
        variant: 'destructive',
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar completado</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro que deseas marcar esta tarea como completada?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isCompleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleComplete}
            disabled={isCompleting}
            className="bg-green-600 hover:bg-green-700 focus:ring-green-600"
          >
            {isCompleting ? 'Completando...' : 'Sí, completar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CompleteConfirmationModal;
