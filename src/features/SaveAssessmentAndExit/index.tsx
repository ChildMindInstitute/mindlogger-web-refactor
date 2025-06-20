import { useContext } from 'react';

import { Button } from '@mui/material';

import { SurveyContext } from '../PassSurvey';

import { prolificParamsSelector } from '~/entities/applet/model/selectors';
import { ROUTES } from '~/shared/constants';
import { variables } from '~/shared/constants/theme/variables';
import Text from '~/shared/ui/Text';
import {
  addSurveyPropsToEvent,
  Mixpanel,
  MixpanelEventType,
  useAppSelector,
  useCustomNavigation,
  useCustomTranslation,
} from '~/shared/utils';

type Props = {
  appletId: string;
  publicAppletKey: string | null;
};

export const SaveAndExitButton = ({ appletId, publicAppletKey }: Props) => {
  const { t } = useCustomTranslation();
  const { applet, activityId, flow } = useContext(SurveyContext);

  const navigator = useCustomNavigation();
  const prolificParams = useAppSelector(prolificParamsSelector);

  const onSaveAndExitClick = () => {
    Mixpanel.track(
      addSurveyPropsToEvent(
        { action: MixpanelEventType.SaveAndExitClicked },
        { applet, activityId, flowId: flow?.id },
      ),
    );

    return navigator.navigate(
      publicAppletKey
        ? ROUTES.publicJoin.navigateTo(publicAppletKey, prolificParams)
        : ROUTES.appletDetails.navigateTo(appletId),
    );
  };

  return (
    <Button
      onClick={onSaveAndExitClick}
      data-testid="assessment-save-and-exit-button"
      variant="tonal"
    >
      <Text color={variables.palette.onSecondaryContainer}>{t('saveAndExit')}</Text>
    </Button>
  );
};
