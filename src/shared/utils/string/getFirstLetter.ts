export const getFirstLetters = (value: string, count = 2) => {
  return value
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .slice(0, count);
};
