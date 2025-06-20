import { Avatar } from '@mui/material';

import SubjectIcon from '~/assets/subject-icon.svg';
import { SubjectDTO } from '~/shared/api/types/subject';
import { variables } from '~/shared/constants/theme/variables';
import { Box, Text } from '~/shared/ui';
import { getSubjectName, useCustomTranslation } from '~/shared/utils';

type Props = {
  subject: SubjectDTO;
};

export const TargetSubjectLabel = ({ subject }: Props) => {
  const { t } = useCustomTranslation();

  const name = getSubjectName(subject);

  return (
    <Box
      data-testid="subject-label"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: '8px',
        gap: '8px',
        backgroundColor: variables.palette.yellowAlpha30,
        whiteSpace: 'nowrap',
      }}
    >
      <Avatar src={SubjectIcon} sx={{ width: '18px', height: '18px', borderRadius: 0 }} />
      <Text color={variables.palette.onSurface} variant="labelLarge">
        {t('targetSubjectLabel', { name })}
      </Text>
    </Box>
  );
};
