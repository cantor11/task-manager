// Format date to YYYY-MM-DD
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

// Format time to HH:MM
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toTimeString().slice(0, 5);
};

// Format date and time to YYYY-MM-DD HH:MM
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(d)} ${formatTime(d)}`;
};

// Get days of the week
export const getDaysOfWeek = (): string[] => {
  return ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
};

// Convert JS day index (0=Sunday) to our day index (0=Monday)
export const convertDayIndex = (dayIndex: number): number => {
  // Convert 0 (Sunday) to 6, 1 (Monday) to 0, etc.
  return dayIndex === 0 ? 6 : dayIndex - 1;
};

// Check if a date is today
export const isToday = (date: Date | string): boolean => {
  const today = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

// Check if a date is in the past
export const isPast = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getTime() < Date.now();
};

// Calculate time difference in minutes
export const getMinutesDifference = (dateA: Date | string, dateB: Date | string): number => {
  const a = typeof dateA === 'string' ? new Date(dateA).getTime() : dateA.getTime();
  const b = typeof dateB === 'string' ? new Date(dateB).getTime() : dateB.getTime();
  
  return Math.floor(Math.abs(a - b) / (1000 * 60));
};
