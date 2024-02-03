import { ActivityStatus } from "~/abstract/lib/GroupBuilder"
import { ActivityDTO } from "~/shared/api"

export type OnActivityCardClickProps = {
  status: ActivityStatus
  flowId: string | null
  eventId: string
  activity: ActivityDTO
}
