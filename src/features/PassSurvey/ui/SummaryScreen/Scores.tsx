import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

import { UIScore } from '../../hooks';

import { Theme } from '~/shared/constants';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

type Props = {
  scores: Array<UIScore>;
};

export const Scores = (props: Props) => {
  return (
    <Box display="flex" gap="16px" flexDirection="column">
      {props.scores.map((score, index) => (
        <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" gap="8px" alignItems="center">
            {score.highlighted && (
              <NotificationImportantIcon
                fontSize="small"
                sx={{ color: Theme.colors.light.errorVariant100 }}
              />
            )}
            <Text
              fontWeight="400"
              fontSize="18px"
              lineHeight="24px"
              color={score.highlighted ? Theme.colors.light.errorVariant100 : undefined}
            >
              {score.label}
            </Text>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            width="136px"
            padding="4px 0px"
            bgcolor={score.highlighted ? Theme.colors.light.errorVariant10 : undefined}
            borderRadius="100px"
          >
            <Text fontWeight="300" fontSize="28px" lineHeight="38px">
              {score.value}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
