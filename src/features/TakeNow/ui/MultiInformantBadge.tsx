import { useMultiInformantState } from '~/entities/applet/model/hooks';
import { MultiInformantBadgeTile } from '~/features/TakeNow/ui/MultiInformantBadgeTile';
import { Theme } from '~/shared/constants';
import { Box } from '~/shared/ui';

export const MultiInformantBadge = () => {
  const { getMultiInformantState } = useMultiInformantState();

  const multiInformantState = getMultiInformantState();

  if (
    multiInformantState.sourceSubject === undefined ||
    multiInformantState.targetSubject === undefined ||
    multiInformantState.sourceSubject.id === multiInformantState.targetSubject.id
  ) {
    return null;
  }

  const { sourceSubject, targetSubject } = multiInformantState;

  return (
    <Box
      display="flex"
      padding="4px"
      alignItems="center"
      gap="4px"
      width="192px"
      height="40px"
      borderRadius="8px"
      border={`1px solid ${Theme.colors.light.surfaceVariant}`}
    >
      <MultiInformantBadgeTile type="Respondent" subject={sourceSubject} />
      <MultiInformantBadgeTile type="Subject" subject={targetSubject} />
    </Box>
  );
};
