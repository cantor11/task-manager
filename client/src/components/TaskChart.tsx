import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTaskStore } from '@/stores/taskStore';

const TaskChart = () => {
  const { tasks } = useTaskStore();

  // Prepare data for the chart
  const chartData = useMemo(() => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const tasksByDay = days.map(day => ({ day, count: 0 }));
    
    // Count only pending tasks by day of the week (exclude completed tasks)
    const pendingTasks = tasks.filter(task => task.status.toLowerCase() !== 'completada');
    
    pendingTasks.forEach(task => {
      const date = new Date(task.dueDate);
      // JS Date has 0 (Sunday) to 6 (Saturday), but we need 0 (Monday) to 6 (Sunday)
      let dayIndex = date.getDay() - 1;
      if (dayIndex < 0) dayIndex = 6; // Sunday becomes the last day (6)
      
      if (tasksByDay[dayIndex]) {
        tasksByDay[dayIndex].count += 1;
      }
    });
    
    return tasksByDay;
  }, [tasks]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip 
              formatter={(value) => [`${value} tareas`, 'Cantidad']}
              labelFormatter={(label) => `${label}`}
            />
            <Bar dataKey="count" fill="#6B46C1" barSize={40} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskChart;
