import { AppletListItem } from "../lib"

import { AppletListDTO } from "~/shared/api"

export class AppletBuilder {
  public convertToAppletList(applets?: AppletListDTO[]): AppletListItem[] {
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
}

export const appletBuilder = new AppletBuilder()
