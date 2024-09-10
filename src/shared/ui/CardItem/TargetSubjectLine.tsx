import { SubjectDTO } from '~/shared/api/types/subject';
import { Box } from '~/shared/ui';
import { TargetSubjectLabel } from '~/widgets/TargetSubjectLabel';

type Props = {
  subject: SubjectDTO | null;
};

export const TargetSubjectLine = ({ subject }: Props) => {
  if (!subject) return null;

  return (
    <Box
      sx={{
        '&:not(:first-child)': { mt: 4.8 },
        mb: 1.2,
      }}
    >
      <TargetSubjectLabel subject={subject} />
    </Box>
  );
};
