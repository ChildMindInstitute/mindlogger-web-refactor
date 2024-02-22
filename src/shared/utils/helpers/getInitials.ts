export const getInitials = (value: string) => {
  if (value.length < 2) {
    return value;
  }

  const splittedValues = value.split(' ');

  const firstInitial = splittedValues[0]?.[0] || '';
  const secondInitial = splittedValues[1]?.[0] || '';

  return `${firstInitial}${secondInitial}`;
};
