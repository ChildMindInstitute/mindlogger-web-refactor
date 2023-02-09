import classNames from "classnames"
import { Container } from "react-bootstrap"

import { ActivityListGroup } from "../lib/types"

import { ActivityList } from "~/entities/activity"
import { useCustomTranslation } from "~/shared/utils"

interface ActivityGroupProps {
  group: ActivityListGroup
}

export const ActivityGroup = ({ group }: ActivityGroupProps) => {
  const { t } = useCustomTranslation()

  return (
    <Container>
      <p className={classNames("mt-2", "text-capitalize")}>{t(group.name)}</p>

      <div>
        <ActivityList activities={group.activities} />
      </div>
    </Container>
  )
}
