import { ActivityDetails } from "./types"

import { ActivityDTO } from "~/shared/api"

export const mapActivityDTOToActivity = (activity: ActivityDTO): ActivityDetails => {
  return {
    id: activity.id,
    name: activity.name,
    description: activity.description,
    image: activity.image,
    splashScreen: activity.splashScreen,
    isSkippable: activity.isSkippable,
    isReviewable: activity.isReviewable,
    responseIsEditable: activity.responseIsEditable,
    order: activity.order,
    items: activity.items,
  }
}
