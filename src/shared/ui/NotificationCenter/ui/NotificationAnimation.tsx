import { PropsWithChildren } from "react"

import { animated, useTransition } from "@react-spring/web"

import { Notification } from "./Notification"
import { Notification as TNotification } from "../lib/types"

type Props = PropsWithChildren<{
  notifications: TNotification[]
  refMap: WeakMap<TNotification, HTMLDivElement>
}>

export const NotificationAnimation = ({ notifications, refMap }: Props) => {
  const transitions = useTransition(notifications, {
    from: { height: "0px" },
    enter: item => async next => {
      await next({ height: `${refMap.get(item)?.offsetHeight ?? 72}px` })
    },
    leave: { height: "0px" },
  })

  return transitions((style, item) => (
    <animated.div style={{ ...style, overflow: "hidden" }}>
      <Notification
        ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
        id={item.id}
        message={item.message}
        type={item.type}
        duration={item.duration}
      />
    </animated.div>
  ))
}
