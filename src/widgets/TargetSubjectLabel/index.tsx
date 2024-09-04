import { Avatar } from '@mui/material';

import SubjectIcon from '~/assets/subject-icon.svg';
import { SubjectDTO } from '~/shared/api/types/subject';
import { Theme } from '~/shared/constants';
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
        backgroundColor: Theme.colors.light.accentYellow30,
        whiteSpace: 'nowrap',
      }}
    >
      <Avatar src={SubjectIcon} sx={{ width: '18px', height: '18px', borderRadius: 0 }} />
      <Text
        color={Theme.colors.light.onSurface}
        fontSize="14px"
        fontWeight="400"
        lineHeight="20px"
        letterSpacing="0.1px"
      >
        {t('targetSubjectLabel', { name })}
      </Text>
    </Box>
  );
};
