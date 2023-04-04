import { PropsWithChildren, useState } from "react"

import { ActivityEventProgressRecord } from "../model/types"
import { ActivityCardItem } from "./ActivityCardItem"
import { SplashScreen } from "./SplashScreen"

type ActivityCardItemListProps = PropsWithChildren<{
  items: ActivityEventProgressRecord[]
  isOnePageAssessment: boolean
  isBackShown: boolean
  isSubmitShown: boolean
  splashScreen: string | null

  toNextStep?: () => void
  toPrevStep?: () => void
  setValue: (itemId: string, answer: string[]) => void
}>

export const ActivityCardItemList = ({
  items,
  isBackShown,
  isOnePageAssessment,
  isSubmitShown,
  toNextStep,
  toPrevStep,
  setValue,
  splashScreen,
}: ActivityCardItemListProps) => {
  const isActivityStarted = items.length > 1

  const [isSplashPassed, setIsSplashPassed] = useState<boolean>(!splashScreen)

  return (
    <div>
      {splashScreen && isOnePageAssessment && (
        <SplashScreen
          splashScreen={splashScreen}
          isActive={!isSplashPassed || !isActivityStarted}
          toNextStep={() => setIsSplashPassed(true)}
        />
      )}

      {(isSplashPassed || isActivityStarted) && (
        <div>
          {items.map((item, index) => {
            const firstElement = 0
            const isActive = index === firstElement || isOnePageAssessment
            const iSubmitButtonShown = isOnePageAssessment && isSubmitShown && index === items.length - 1

            const initialAnswer = item.answer
            return (
              <ActivityCardItem
                key={item.id}
                activityItem={item}
                isBackShown={isBackShown}
                isOnePageAssessment={isOnePageAssessment}
                isSubmitShown={iSubmitButtonShown}
                toNextStep={toNextStep}
                toPrevStep={toPrevStep}
                isActive={isActive}
                values={initialAnswer}
                setValue={setValue}
              />
            )
          })}
        </div>
      )}

      {splashScreen && !isOnePageAssessment && (
        <SplashScreen
          splashScreen={splashScreen}
          isActive={!isSplashPassed || !isActivityStarted}
          toNextStep={() => setIsSplashPassed(true)}
        />
      )}
    </div>
  )
}
