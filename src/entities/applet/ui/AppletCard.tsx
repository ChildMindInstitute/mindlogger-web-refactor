import { CustomCard } from "~/shared/ui"

const AppletCard = () => {
  // This mock will be removed
  const appletMock = {
    id: "some-id",
    title: "mock-title",
    description: "mock-description",
    imageSrc: "https://picsum.photos/200",
    onClick: () => console.log("click card"),
  }

  return (
    <CustomCard
      id={appletMock.id}
      title={appletMock.title}
      description={appletMock.description}
      imageSrc={appletMock.imageSrc}
      onClick={appletMock.onClick}
    />
  )
}

export default AppletCard
