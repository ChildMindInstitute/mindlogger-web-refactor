import { useCallback, useContext, useEffect } from 'react';

import { AppletDetailsContext } from '../../lib';

import { ActivityPipelineType } from '~/abstract/lib';
import { appletModel } from '~/entities/applet';
import { CompletedEntitiesDTO, CompletedEntityDTO } from '~/shared/api';

type FilterCompletedEntitiesProps = {
  completedEntities?: CompletedEntitiesDTO;
};

export const useEntitiesSync = ({ completedEntities }: FilterCompletedEntitiesProps) => {
  const { applet } = useContext(AppletDetailsContext);
  const { saveGroupProgress, getGroupProgress } = appletModel.hooks.useGroupProgressStateManager();

  const syncEntity = useCallback(
    (entity: CompletedEntityDTO) => {
      const hoursMinutes = entity.localEndTime.split(':');
      const endAtDate = new Date(entity.localEndDate).setHours(
        Number(hoursMinutes[0]),
        Number(hoursMinutes[1]),
      );

      const entityId = entity.id;
      const eventId = entity.scheduledEventId;
      // Normalize targetSubjectId to null for self-reports
      const targetSubjectId =
        entity.targetSubjectId === applet.respondentMeta?.subjectId ? null : entity.targetSubjectId;

      const groupProgress = getGroupProgress({
        entityId,
        eventId,
        targetSubjectId,
      });

      if (!groupProgress) {
        return saveGroupProgress({
          activityId: entityId,
          eventId,
          targetSubjectId,
          progressPayload: {
            type: ActivityPipelineType.Regular,
            startAt: null,
            endAt: new Date(endAtDate).getTime(),
            context: {
              summaryData: {},
            },
          },
        });
      }

      if (groupProgress.endAt) {
        const isServerEndAtBigger = endAtDate > new Date(groupProgress.endAt).getTime();

        if (!isServerEndAtBigger) {
          return;
        }

        return saveGroupProgress({
          activityId: entityId,
          eventId,
          targetSubjectId,
          progressPayload: {
            ...groupProgress,
            endAt: new Date(endAtDate).getTime(),
          },
        });
      }
    },
    [applet.respondentMeta?.subjectId, getGroupProgress, saveGroupProgress],
  );

  useEffect(() => {
    if (!completedEntities) {
      return;
    }

    [...completedEntities.activities, ...completedEntities.activityFlows].forEach(syncEntity);
  }, [completedEntities, syncEntity]);
};
