import axiosService from './axios';
import {
  AppletDetailsBaseInfoSuccess,
  AppletListSuccessResponse,
  AppletSuccessResponse,
  GetAppletByIdPayload,
  GetPublicAppletActivityByIdPayload,
  GetPublicAppletByIdPayload,
} from '../types/applet';

function appletService() {
  return {
    getAll() {
      return axiosService.get<AppletListSuccessResponse>('/applets?roles=respondent');
    },

    getById(payload: GetAppletByIdPayload) {
      return axiosService.get<AppletSuccessResponse>(`/applets/${payload.appletId}`);
    },
    getPublicByKey(payload: GetPublicAppletByIdPayload) {
      return axiosService.get<AppletSuccessResponse>(`/public/applets/${payload.publicAppletKey}`);
    },
    getPublicAppletActivityById(payload: GetPublicAppletActivityByIdPayload) {
      return axiosService.get(`/public/applet/${payload.publicAppletKey}/activity/${payload.activityId}`);
    },
    getBaseDetailsById(id: string) {
      return axiosService.get<AppletDetailsBaseInfoSuccess>(`/applets/${id}/base_info`);
    },
    getPublicBaseDetailsByKey(key: string) {
      return axiosService.get<AppletDetailsBaseInfoSuccess>(`/public/applets/${key}/base_info`);
    },
  };
}

export default appletService();
