import dayjs, { OpUnitType } from 'dayjs';

export const DEFAULT_TIME_FORMAT = 'HH:mm';
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_DATE_TIME_FORMAT = `${DEFAULT_DATE_FORMAT} ${DEFAULT_TIME_FORMAT}:ss`;

/**
 * Converts a timestamp to a Date object.
 *
 * @param {number | string} ts - The timestamp to convert, which can be a number or a string.
 * @returns {Date} A Date object representing the given timestamp.
 */
const toDate = (ts: number | string): Date => {
  if (isNaN(new Date(ts).getDate())) {
    ts = parseInt(ts?.toString(), 10);
  }
  return new Date(ts);
};

export const tsToDate = (ts: string | number): string =>
  toDate(ts).toLocaleDateString();
export const tsToTime = (ts: string | number): string =>
  toDate(ts).toLocaleTimeString();
export const tsToLocaleDateTime = (ts: string | number): string =>
  `${tsToDate(ts)} ${tsToTime(ts)}`;

export const dateFormat = (
  date: string | number | dayjs.Dayjs | Date,
  format = DEFAULT_DATE_FORMAT,
) => `${dayjs(date).format(format)} 00:00:00`;
export const dateTimeFormat = (
  ts: string | number,
  format = DEFAULT_DATE_TIME_FORMAT,
) => `${dayjs(ts).format(format)}`;

export const nextDayOf = (amount = 1) =>
  dayjs().add(amount, 'day').endOf('day');

export const disabledDate = (
  current: number,
  unitOfTime: OpUnitType = 'day',
) => {
  const cDate = dayjs(current);
  const disableAt = dayjs().endOf(unitOfTime);

  return cDate.isBefore(disableAt);
};
