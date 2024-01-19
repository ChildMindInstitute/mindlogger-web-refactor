import { ActivityType } from "./types"

import { ActivityPipelineType } from "~/abstract/lib"
import { ScheduleEvent } from "~/entities/event"
import { ItemResponseTypeDTO } from "~/shared/api"

export type EntityBase = {
  id: string
  name: string
  description: string
  image: string | null
  isHidden: boolean
  order: number
  containsResponseTypes: Array<ItemResponseTypeDTO> | null
}

export type Activity = EntityBase & {
  type: ActivityType
  pipelineType: ActivityPipelineType.Regular
}

export type ActivityFlow = EntityBase & {
  hideBadge: boolean
  activityIds: Array<string>
  pipelineType: ActivityPipelineType.Flow
}

export type Entity = Activity | ActivityFlow

export type EventEntity = {
  entity: Entity
  event: ScheduleEvent
}

export type EntityType = "regular" | "flow"
