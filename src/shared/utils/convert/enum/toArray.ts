export interface EnumToArrayOutput<T extends Record<string, string>> {
  key: keyof T;
  value: T[keyof T];
}

export const enumToArray = <E extends Record<string, string>>(
  enumValue: E,
): EnumToArrayOutput<E>[] => {
  const enumKeys = Object.keys(enumValue) as Array<keyof E>;

  return enumKeys.map((key) => ({ key, value: enumValue[key] }));
};
