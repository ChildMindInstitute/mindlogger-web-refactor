import { SplashScreenItem } from "~/shared/ui"

type SplashProps = {
  splashScreen: string | null
}

export const Splash = ({ splashScreen }: SplashProps) => {
  const isSplashScreenExist = !!splashScreen

  return <>{isSplashScreenExist ? <SplashScreenItem imageSrc={splashScreen} /> : <></>}</>
}
