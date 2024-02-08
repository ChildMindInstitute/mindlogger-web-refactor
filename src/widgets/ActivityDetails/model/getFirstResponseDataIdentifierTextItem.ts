import { appletModel } from '~/entities/applet';

export const getFirstResponseDataIdentifierTextItem = (
  activityEventProgress: appletModel.ItemRecord[],
): string | null => {
  const firstResponseDataIdentifier = activityEventProgress.find(item => {
    if (item.responseType === 'text') {
      return item.config.responseDataIdentifier;
    }
    return false;
  });

  if (!firstResponseDataIdentifier) {
    return null;
  }

  return firstResponseDataIdentifier.answer[0];
};
