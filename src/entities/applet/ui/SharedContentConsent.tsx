import { ConsentCheckbox } from './ConsentCheckbox';
import { ConsentPublicModal } from './ConsentPublicModal';
import { actions } from '../model';
import { selectConsents } from '../model/selectors';

import Box from '~/shared/ui/Box';
import Text from '~/shared/ui/Text';
import { useAppDispatch, useAppSelector, useCustomTranslation } from '~/shared/utils';

type Props = {
  appletId: string;
};

export const SharedContentConsent = ({ appletId }: Props) => {
  const { t } = useCustomTranslation();

  const dispatch = useAppDispatch();

  const consents = useAppSelector(selectConsents);

  if (!consents) {
    return null;
  }

  const appletConsents = consents[appletId];

  if (!appletConsents) {
    return null;
  }

  const toggleShareConsent = () => {
    dispatch(actions.toggleShareConsent({ appletId }));
  };

  const toggleMediaConsent = () => {
    dispatch(actions.toggleMediaConsent({ appletId }));
  };

  return (
    <Box display="flex" justifyContent="flex-start" margin="8px">
      <Box display="flex" flexDirection="column">
        <ConsentCheckbox
          id={`shareToPublic-${appletId}`}
          checked={appletConsents.shareToPublic}
          onChange={toggleShareConsent}
          label={
            <Text>
              {t('data_sharing.consent')} {<ConsentPublicModal />}
            </Text>
          }
        />
        <ConsentCheckbox
          id={`shareMediaToPublic-${appletId}`}
          checked={appletConsents.shareMediaToPublic}
          onChange={toggleMediaConsent}
          sx={{
            marginLeft: '16px',
          }}
          label={
            <Text>
              {t('data_sharing.media_consent')} {<ConsentPublicModal />}
            </Text>
          }
        />
      </Box>
    </Box>
  );
};
