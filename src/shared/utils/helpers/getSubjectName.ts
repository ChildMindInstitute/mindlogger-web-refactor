import { SubjectDTO } from '~/shared/api/types/subject';

export const getSubjectName = ({ firstName, lastName }: SubjectDTO) => {
  const lastInitial = lastName[0] ? ` ${lastName[0]}.` : '';

  return `${firstName}${lastInitial}`;
};
