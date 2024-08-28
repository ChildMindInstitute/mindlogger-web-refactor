import { ActivityPipelineType } from '~/abstract/lib';
import { Activity, ActivityFlow, ActivityType } from '~/abstract/lib/GroupBuilder';
import { ActivityBaseDTO, ActivityFlowDTO } from '~/shared/api';

export const mapActivitiesFromDto = (dtos: ActivityBaseDTO[]): Activity[] => {
  return dtos.map((dto) => ({
    autoAssign: dto.autoAssign,
    description: dto.description,
    id: dto.id,
    image: dto.image,
    isHidden: dto.isHidden,
    name: dto.name,
    order: dto.order,
    pipelineType: ActivityPipelineType.Regular,
    type: ActivityType.NotDefined,
  }));
};

export const mapActivityFlowsFromDto = (dtos: ActivityFlowDTO[]): ActivityFlow[] => {
  return dtos.map((dto) => ({
    activityIds: dto.activityIds,
    autoAssign: dto.autoAssign,
    description: dto.description,
    hideBadge: dto.hideBadge,
    id: dto.id,
    image: null,
    isHidden: dto.isHidden,
    name: dto.name,
    order: dto.order,
    pipelineType: ActivityPipelineType.Flow,
  }));
};
