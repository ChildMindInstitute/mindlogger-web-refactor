import { ItemCardButtonsConfig } from "../lib"
import { ItemCardButton } from "./ItemCardButtons"
import { Splash } from "./items/Splash"

import { CardItem } from "~/shared/ui"

type SplashScreenProps = {
  splashScreen: string | null
  isActive: boolean
  toNextStep: () => void
}

export const SplashScreen = ({ splashScreen, isActive, toNextStep }: SplashScreenProps) => {
  const buttonConfig: ItemCardButtonsConfig = {}

  return (
    <CardItem
      markdown={""}
      buttons={isActive ? <ItemCardButton config={buttonConfig} onNextButtonClick={toNextStep} /> : <></>}>
      <Splash splashScreen={splashScreen} />
    </CardItem>
  )
}
