import { Scores } from './Scores';

import { UIActivityScores } from '~/features/PassSurvey';
import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

type Props = {
  score: UIActivityScores;
};

export const ScoreSection = (props: Props) => {
  return (
    <Box padding="0px 16px" data-testid="score-section">
      <Text
        fontWeight="600"
        fontSize="24px"
        lineHeight="32px"
        margin="0px 0px 16px 0px"
        testid={`score-section-title activity-name-${props.score.activityName}`}
      >
        {props.score.activityName}
      </Text>
      <Scores scores={props.score.scores} />
    </Box>
  );
};
