export const isObjectEmpty = (obj: Record<any, any> | undefined) => {
  if (!obj) {
    return false;
  }

  return !Object.keys(obj).length;
};
