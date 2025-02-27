import { useContext } from 'react';

import ButtonBase from '@mui/material/ButtonBase';

import { SurveyContext } from '../PassSurvey';

import { prolificParamsSelector } from '~/entities/applet/model/selectors';
import { ROUTES, Theme } from '~/shared/constants';
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
    <ButtonBase
      onClick={onSaveAndExitClick}
      data-testid="assessment-save-and-exit-button"
      sx={{
        borderRadius: '100px',
        padding: '10px 12px',
        transition: 'all 0.2s',
        '&:hover': { backgroundColor: Theme.colors.light.primary008 },
        '&:focus': { backgroundColor: Theme.colors.light.primary012 },
        '&:active': { backgroundColor: Theme.colors.light.primary012 },
      }}
    >
      <Text variant="body1" color={Theme.colors.light.primary} fontSize="16px">
        {t('save_and_exit')}
      </Text>
    </ButtonBase>
  );
};
