export const isObjectEmpty = (obj: Record<string, unknown> | undefined) => {
  if (!obj) {
    return false;
  }

  return !Object.keys(obj).length;
};
