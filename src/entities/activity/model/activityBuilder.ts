import { ActivityListItem, ActivityProgressPreview } from "../lib"
import { getRandomInt } from "../lib/getRandomInt"

export class ActivityBuilder {
  public convertToActivityProgressPreview(activities: ActivityListItem[]): ActivityProgressPreview[] {
    return activities.map(activity => {
      const itemsLength = 10 // activity.items.length in the real implementation
      const currentProgressItem = getRandomInt(10) // TODO: When redux for progress will implemented, add selector to progress activity and get activity order

      return {
        id: activity.activityId,
        title: activity.name,
        progress: (currentProgressItem / itemsLength) * 100,
      }
    })
  }
}

const activityBuilder = new ActivityBuilder()
export default activityBuilder
