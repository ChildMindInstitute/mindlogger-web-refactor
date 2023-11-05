import { Activity, ActivityFlow } from "../lib"

import { ActivityPipelineType, ActivityType } from "~/entities/activity"
import { ActivityFlowDTO, AppletDetailsActivityDTO } from "~/shared/api"

export const mapActivitiesFromDto = (dtos: AppletDetailsActivityDTO[]): Activity[] => {
  return dtos.map(dto => ({
    description: dto.description,
    id: dto.id,
    image: dto.image,
    name: dto.name,
    isHidden: dto.isHidden,
    order: dto.order,
    pipelineType: ActivityPipelineType.Regular,
    type: ActivityType.NotDefined,
  }))
}

export const mapActivityFlowsFromDto = (dtos: ActivityFlowDTO[]): ActivityFlow[] => {
  return dtos.map(dto => ({
    activityIds: dto.activityIds,
    description: dto.description,
    hideBadge: dto.hideBadge,
    order: dto.order,
    id: dto.id,
    name: dto.name,
    isHidden: dto.isHidden,
    pipelineType: ActivityPipelineType.Flow,
  }))
}
