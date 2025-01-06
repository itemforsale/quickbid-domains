export type ISODateString = string;

export const toISOString = (date: Date | string): ISODateString => {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return new Date(date).toISOString();
};

export const parseDate = (date: ISODateString | Date | undefined): Date => {
  if (!date) return new Date();
  if (date instanceof Date) return date;
  return new Date(date);
};