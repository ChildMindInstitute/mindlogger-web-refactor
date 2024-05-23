import { Scores } from './Scores';
import { UIActivityScores } from '../../hooks';

import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';

type Props = {
  score: UIActivityScores;
};

export const ScoreSection = (props: Props) => {
  return (
    <Box padding="0px 16px">
      <Text fontWeight="600" fontSize="24px" lineHeight="32px" margin="0px 0px 16px 0px">
        {props.score.activityName}
      </Text>
      <Scores scores={props.score.scores} />
    </Box>
  );
};
