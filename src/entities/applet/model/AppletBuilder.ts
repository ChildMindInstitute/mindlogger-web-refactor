import { AppletBase, AppletDetails } from "../lib"

import { AppletBaseDTO, AppletDetailsDTO } from "~/shared/api"

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

  public convertToAppletDetails(applet?: AppletDetailsDTO): AppletDetails | null {
    if (!applet) {
      return null
    }

    return {
      id: applet.id,
      displayName: applet.displayName,
      description: applet.description,
      about: applet.about,
      watermark: applet.watermark,
      image: applet.image,
      activities: applet.activities,
      activityFlows: applet.activityFlows,
    }
  }
}

export const appletBuilder = new AppletBuilder()
