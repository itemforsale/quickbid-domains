export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

export const toISOString = (date: Date | string): string => {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return new Date(date).toISOString();
};

export const parseDate = (date: string | Date | undefined): Date => {
  if (!date) return new Date();
  if (date instanceof Date) return date;
  return new Date(date);
};