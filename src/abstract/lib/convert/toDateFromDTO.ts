import { stringToDateMidnightTime } from '~/shared/utils';

export const buildDateFromDto = (dto: string | null | undefined): Date | null => {
  if (!dto) {
    return null;
  }
  const result = stringToDateMidnightTime(dto);

  if (result.getFullYear() === 1 || result.getFullYear() === 9999) {
    return null;
  }

  return result;
};
