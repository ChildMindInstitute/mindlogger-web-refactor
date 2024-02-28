export const stringContainsOnlyNumbers = (value: string): boolean => {
  return /^[0-9]+$/.test(value);
};
