import { useMultiInformantState } from '~/entities/applet/model/hooks';
import { MultiInformantBadgeTile } from '~/features/TakeNow/ui/MultiInformantBadgeTile';
import { Theme } from '~/shared/constants';
import { Box } from '~/shared/ui';
import { useFeatureFlags } from '~/shared/utils/hooks/useFeatureFlags';

const borderSize = 1;

export const MultiInformantBadge = () => {
  const { getMultiInformantState, isInMultiInformantFlow } = useMultiInformantState();
  const { featureFlags } = useFeatureFlags();

  if (!isInMultiInformantFlow() || !featureFlags.enableMultiInformant) {
    return null;
  }

  const { sourceSubject, targetSubject } = getMultiInformantState();

  if (!sourceSubject || !targetSubject) {
    return null;
  }

  return (
    <Box
      display="flex"
      padding={`${4 - borderSize}px`}
      alignItems="center"
      gap="4px"
      width="192px"
      borderRadius="8px"
      border={`${borderSize}px solid ${Theme.colors.light.surfaceVariant}`}
    >
      <MultiInformantBadgeTile type="Respondent" subject={sourceSubject} />
      <MultiInformantBadgeTile type="Subject" subject={targetSubject} />
    </Box>
  );
};
