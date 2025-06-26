import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

import { UIScore } from '~/features/PassSurvey';
import { variables } from '~/shared/constants/theme/variables';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

type Props = {
  scores: Array<UIScore>;
};

export const Scores = (props: Props) => {
  return (
    <Box display="flex" gap="16px" flexDirection="column">
      {props.scores.map((score, index) => (
        <Box
          key={index}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          data-testid="score-item"
        >
          <Box display="flex" gap="8px" alignItems="center">
            {score.highlighted && (
              <NotificationImportantIcon
                fontSize="medium"
                sx={{ color: variables.palette.error }}
                data-testid="score-item-highlighted-icon"
              />
            )}
            <Text
              variant="titleLargishBold"
              color={score.highlighted ? variables.palette.error : undefined}
              testid="score-item-label"
            >
              {score.label}
            </Text>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            minWidth="120px"
            padding="4px 0px"
            bgcolor={
              score.highlighted ? variables.palette.errorContainer : variables.palette.surface1
            }
            borderRadius="100px"
            data-testid="score-item-value-container"
          >
            <Text
              variant="titleLargeBold"
              color={score.highlighted ? variables.palette.error : undefined}
              testid="score-item-value"
            >
              {score.value}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
