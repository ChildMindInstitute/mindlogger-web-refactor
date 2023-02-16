import {
  AcceptInvitationByIdPayload,
  DeclineInvitationByIdPayload,
  GetInvitationByIdPayload,
  GetInvitationSuccessResponse,
} from "../types/invitation"
import axiosService from "./axios"

function invitationService() {
  return {
    getInvitationById(payload: GetInvitationByIdPayload) {
      return axiosService.get<GetInvitationSuccessResponse>(`/invitations/${payload.invitationId}`)
    },
    acceptInvitation(payload: AcceptInvitationByIdPayload) {
      return axiosService.post(`/invitations/approve/${payload.invitationId}`)
    },
    declineInvitation(payload: DeclineInvitationByIdPayload) {
      return axiosService.post(`/invitations/decline/${payload.invitationId}`)
    },

    getPrivateInvitationById(payload: GetInvitationByIdPayload) {
      return axiosService.get<GetInvitationSuccessResponse>(`/invitations/private/${payload.invitationId}`)
    },
    acceptPrivateInvitation(payload: AcceptInvitationByIdPayload) {
      return axiosService.post(`/invitations/private/${payload.invitationId}/accept`)
    },
    declinePrivateInvitation(payload: DeclineInvitationByIdPayload) {
      return axiosService.post(`/invitations/private/${payload.invitationId}/decline`)
    },
  }
}

export default invitationService()
