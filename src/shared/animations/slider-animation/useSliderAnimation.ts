import { useTransition } from "@react-spring/web"

type Direction = "left" | "right" | null

export const useSliderAnimation = () => {
  const getDirection = (step: number, prevStep: number): Direction => {
    if (step === prevStep) {
      return null
    }

    return step > prevStep ? "right" : "left"
  }

  const getTransitionConfig = (direction: Direction): Parameters<typeof useTransition>[1] => {
    if (direction === "right") {
      return {
        from: { opacity: 0, transform: "translate3d(100%,0,0)" },
        enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
        leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
      }
    }

    if (direction === "left") {
      return {
        from: { opacity: 0, transform: "translate3d(-50%,0,0)" },
        enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
        leave: { opacity: 0, transform: "translate3d(100%,0,0)" },
      }
    }

    return {}
  }

  return { getDirection, getTransitionConfig }
}
