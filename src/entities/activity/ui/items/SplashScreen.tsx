import { SplashScreenItem } from "~/shared/ui"

type SplashScreenProps = {
  imageSrc: string
}

export const SplashScreen = ({ imageSrc }: SplashScreenProps) => {
  return <SplashScreenItem imageSrc={imageSrc} />
}
