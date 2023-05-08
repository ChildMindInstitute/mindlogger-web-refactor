import classNames from "classnames"
import { Container } from "react-bootstrap"

import { ActivityListGroup } from "../lib/types"

import { ActivityList, ActivityListItem } from "~/entities/activity"
import { useCustomTranslation } from "~/shared/utils"

interface ActivityGroupProps {
  group: ActivityListGroup
  isPublic: boolean
  onActivityCardClick: (activity: ActivityListItem) => void
}

export const ActivityGroup = ({ group, onActivityCardClick, isPublic }: ActivityGroupProps) => {
  const { t } = useCustomTranslation()

  return (
    <Container>
      <p className={classNames("mt-2", "text-capitalize")}>{t(group.name)}</p>

      <div>
        <ActivityList activities={group.activities} onActivityCardClick={onActivityCardClick} isPublic={isPublic} />
      </div>
    </Container>
  )
}
