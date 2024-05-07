import { ConsentCheckbox } from './ConsentCheckbox';
import { ConsentPublicModal } from './ConsentPublicModal';
import { actions } from '../model';
import { selectConsents } from '../model/selectors';

import Box from '~/shared/ui/Box';
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
    <Box display="flex" justifyContent="center" margin="8px">
      <Box display="flex" flexDirection="column">
        <ConsentCheckbox
          id={`shareToPublic-${appletId}`}
          value={consents.shareToPublic?.shareToPublic}
          onChange={toggleShareConsent}
          label={
            <p>
              {t('data_sharing.consent')} {<ConsentPublicModal />}
            </p>
          }
        />
        <ConsentCheckbox
          id={`shareMediaToPublic-${appletId}`}
          value={consents.shareMediaToPublic?.shareMediaToPublic}
          onChange={toggleMediaConsent}
          label={
            <p>
              {t('data_sharing.media_consent')} {<ConsentPublicModal />}
            </p>
          }
        />
      </Box>
    </Box>
  );
};
