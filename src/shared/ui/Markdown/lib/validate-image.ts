export const validateImage = (url: string): Promise<boolean> => {
  return new Promise(resolve => {
    const image = new Image()

    image.onload = () => {
      resolve(true)
    }

    image.onerror = () => {
      resolve(false)
    }

    image.src = url
  })
}
