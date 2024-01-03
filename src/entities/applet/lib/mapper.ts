import { AppletListItem } from "."

import { AppletListDTO } from "~/shared/api"

export function mapToAppletList(applets?: AppletListDTO[]): AppletListItem[] {
  if (!applets) {
    return []
  }

  return applets.map((applet: AppletListDTO) => ({
    id: applet.id,
    displayName: applet.displayName,
    description: applet.description,
    about: applet.about,
    watermark: applet.watermark,
    image: applet.image,
  }))
}
