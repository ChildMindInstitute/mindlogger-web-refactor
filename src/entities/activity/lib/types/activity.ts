import { ActivityItemDetailsDTO } from '~/shared/api';

export type ActivityDetails = {
  id: string;
  name: string;
  description: string;
  image: string;
  splashScreen: string;
  isSkippable: boolean;
  isReviewable: boolean;
  responseIsEditable: boolean;
  order: number;
  items: ActivityItemDetailsDTO[];
};
