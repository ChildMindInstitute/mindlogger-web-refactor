import { ActivityItemType } from '~/entities/activity';

export const canItemHaveAnswer = (type: ActivityItemType): boolean => {
  return type !== 'splashScreen' && type !== 'message' && type !== 'audioPlayer';
};
