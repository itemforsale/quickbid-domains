export type ISODateString = string;

export const toISOString = (date: Date | string): ISODateString => {
  if (typeof date === 'string') return date;
  return date.toISOString();
};

export const parseDate = (date: ISODateString | Date): Date => {
  if (date instanceof Date) return date;
  return new Date(date);
};