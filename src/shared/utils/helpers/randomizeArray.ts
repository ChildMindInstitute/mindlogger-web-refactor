export const randomizeArray = <T>(array: Array<T>): Array<T> => {
  if (!array) {
    return [];
  }

  const arrayCopy = [...array];

  return arrayCopy.sort(() => Math.random() - 0.5);
};
