import { ItemCardButtonsConfig } from "../lib"
import { ItemCardButton } from "./ItemCardButtons"

import { CardItem, SplashScreenItem } from "~/shared/ui"

type SplashScreenProps = {
  splashScreen: string
  isActive: boolean
  toNextStep: () => void
}

export const SplashScreen = ({ splashScreen, isActive, toNextStep }: SplashScreenProps) => {
  const buttonConfig: ItemCardButtonsConfig = {
    isBackShown: false,
    isSubmitShown: false,
    isNextDisable: false,
  }

  return (
    <CardItem
      markdown={""}
      buttons={isActive ? <ItemCardButton config={buttonConfig} onNextButtonClick={toNextStep} /> : <></>}>
      <SplashScreenItem imageSrc={splashScreen} />
    </CardItem>
  )
}
