export const formatDate = (date: Date | string): Date => {
  return new Date(date);
};

export const parseDate = (date: string | Date): Date => {
  return new Date(date);
};

export const toISOString = (date: Date | string): string => {
  return new Date(date).toISOString();
};