export const formatDate = (date: string | Date | undefined): string => {
  if (!date) return '';
  return typeof date === 'string' ? date : date.toISOString();
};

export const parseDate = (date: string | Date | undefined): Date => {
  if (!date) return new Date();
  return typeof date === 'string' ? new Date(date) : date;
};