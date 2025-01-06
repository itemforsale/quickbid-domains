export type ISODateString = string;

export const toISOString = (date: Date | string): ISODateString => {
  if (typeof date === 'string') return date;
  return date.toISOString();
};

export const parseDate = (date: ISODateString | Date): Date => {
  if (date instanceof Date) return date;
  return new Date(date);
};

export const formatDate = (date: ISODateString | Date): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString();
};