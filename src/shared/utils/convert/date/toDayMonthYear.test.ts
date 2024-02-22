import { dateToDayMonthYear, validateDate } from './toDayMonthYear';

it('Should return a date in DayMonthYear format', () => {
  expect(dateToDayMonthYear(new Date(2020, 0, 1))).toStrictEqual({
    day: 1,
    month: 1,
    year: 2020,
  });
  expect(dateToDayMonthYear(new Date(2000, 11, 31))).toStrictEqual({
    day: 31,
    month: 12,
    year: 2000,
  });
});

it('Should validate a date', () => {
  expect(validateDate(new Date(2020, 0, 1))).toBeTruthy();
  expect(validateDate(new Date(2000, 11, 31))).toBeTruthy();

  expect(validateDate(new Date(1899, 0, 1))).toBeFalsy();
  expect(validateDate(new Date(2200, 0, 1))).toBeFalsy();
});
