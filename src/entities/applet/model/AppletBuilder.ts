import { ActivityListItem, activityModel } from "../../activity"
import { AppletListItem, AppletDetails, ActivityFlow } from "../lib"

import { AppletListDTO, AppletDetailsDTO, EventsByAppletIdResponseDTO } from "~/shared/api"

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

  public convertToAppletDetails(
    applet?: AppletDetailsDTO,
    events?: EventsByAppletIdResponseDTO,
  ): AppletDetails<ActivityListItem, ActivityFlow> | null {
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
      activities: activityModel.activityBuilder.convertToActivityList(applet.activities, events),
      activityFlows: applet.activityFlows,
    }
  }
}

export const appletBuilder = new AppletBuilder()
