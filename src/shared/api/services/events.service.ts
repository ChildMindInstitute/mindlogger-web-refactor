import axiosService from './axios';
import {
  GetEventsByAppletIdPayload,
  GetEventsByPublicAppletKey,
  SuccessAllUserEventsResponse,
  SuccessEventsByAppletIdResponse,
} from '../types';

function eventService() {
  return {
    getEventsByAppletId(payload: GetEventsByAppletIdPayload) {
      return axiosService.get<SuccessEventsByAppletIdResponse>(
        `/users/me/events/${payload.appletId}`,
      );
    },
    getUserEvents() {
      return axiosService.get<SuccessAllUserEventsResponse>('/users/me/events');
    },
    getEventsByPublicAppletKey(payload: GetEventsByPublicAppletKey) {
      return axiosService.get<SuccessEventsByAppletIdResponse>(
        `/public/applets/${payload.publicAppletKey}/events`,
      );
    },
  };
}

export default eventService();
