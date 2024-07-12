import ActivityService from './activity.service';
import { AnswerPayload, GetCompletedEntitiesPayload } from '../types';

type Options = {
  isPublic: boolean;
};

function ActivityApiProxyService() {
  return {
    getActivityById: (id: string, options: Options) =>
      options.isPublic ? ActivityService.getPublicById(id) : ActivityService.getById(id),

    submitAnswer: (payload: AnswerPayload, options: Options) =>
      options.isPublic
        ? ActivityService.publicSaveAnswers(payload)
        : ActivityService.saveAnswers(payload),

    getCompletedEntities: (payload: GetCompletedEntitiesPayload) =>
      ActivityService.getCompletedEntities(payload),
  };
}

export default ActivityApiProxyService();
