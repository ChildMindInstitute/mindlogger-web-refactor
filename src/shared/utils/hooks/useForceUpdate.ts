import { useCallback, useState } from "react"

export const useForceUpdate = () => {
  const [, update] = useState({})

  const forceUpdate = useCallback(() => update({}), [])

  return forceUpdate
}
