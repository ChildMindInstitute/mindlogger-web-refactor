export const splitList = <TList>(array: Array<TList>): [Array<TList>, Array<TList>] => {
  const evenItems = array.filter((option, index) => index < Math.ceil(array.length / 2))
  const oddItems = array.filter((option, index) => index >= Math.ceil(array.length / 2))

  return [evenItems, oddItems]
}
