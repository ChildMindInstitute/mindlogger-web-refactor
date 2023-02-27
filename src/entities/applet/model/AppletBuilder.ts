import { AppletBase } from "../lib"

import { AppletBaseDTO } from "~/shared/api"

export class AppletBuilder {
  public convertToAppletList(applets?: AppletBaseDTO[]): AppletBase[] {
    if (!applets) {
      return []
    }

    return applets.map((applet: AppletBaseDTO) => ({
      id: applet.id,
      displayName: applet.displayName,
      description: applet.description,
      about: applet.about,
      watermark: applet.watermark,
      image: applet.image,
    }))
  }

  public convertToAppletDetails() {}

  private createApplet() {}
}

const appletBuilder = new AppletBuilder()
export default appletBuilder
