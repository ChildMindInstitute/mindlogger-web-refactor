import { Alerts } from './Alerts';
import { SummaryScreenItem } from '../../../lib';

import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useCustomTranslation, useFlowType } from '~/shared/utils';
import { useSummaryData } from '~/widgets/ActivityDetails/model/hooks/useSummaryData';

type Props = {
  item: SummaryScreenItem;
};

export const SummaryScreen = (props: Props) => {
  const { isFlow, flowId } = useFlowType();
  const { t } = useCustomTranslation();

  const { summaryData } = useSummaryData({
    activityId: props.item.config.activityId,
    activityName: props.item.config.activityName,
    eventId: props.item.config.eventId,
    scoresAndReports: props.item.config.scoresAndReports,
    flowId: isFlow ? flowId : undefined,
  });

  return (
    <Box>
      <Box>
        <Text fontWeight="400" fontSize="40px" lineHeight="54px">
          {t('reportSummary')}
        </Text>
        {summaryData && summaryData.alerts.length > 0 && <Alerts alerts={summaryData.alerts} />}
      </Box>
    </Box>
  );
};
