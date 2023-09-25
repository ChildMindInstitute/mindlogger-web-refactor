import { PropsWithChildren, useCallback, useEffect, useRef } from "react"

import { useSpring, animated } from "@react-spring/web"

type Props = PropsWithChildren<{
  notificationLifeTime: number
  animationDuration?: number | undefined
}>

export const NotificationAnimation = ({ children, notificationLifeTime, animationDuration = 350 }: Props) => {
  const [springs, api] = useSpring(() => ({
    from: { height: "0px" },
    config: { duration: animationDuration },
  }))
  const boxRef = useRef<HTMLDivElement | null>(null)

  const animationIn = useCallback(() => {
    const elementHeight = boxRef.current?.clientHeight ?? 48

    api.start({
      to: {
        height: `${elementHeight}px`,
      },
    })
  }, [api])

  const animationOut = useCallback(() => {
    api.start({
      to: {
        height: "0px",
      },
    })
  }, [api])

  useEffect(() => {
    animationIn()

    setTimeout(animationOut, notificationLifeTime - animationDuration)
  }, [animationIn, animationOut, notificationLifeTime, animationDuration])

  return (
    <animated.div style={{ ...springs, overflow: "hidden" }}>
      <div ref={boxRef}>{children}</div>
    </animated.div>
  )
}
