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
      return axiosService.post(`/invitations/${payload.invitationId}/accept`)
    },
    declineInvitation(payload: DeclineInvitationByIdPayload) {
      return axiosService.delete(`/invitations/${payload.invitationId}/decline`)
    },

    getPrivateInvitationById(payload: GetInvitationByIdPayload) {
      return axiosService.get<GetInvitationSuccessResponse>(`/invitations/private/${payload.invitationId}`)
    },
    acceptPrivateInvitation(payload: AcceptInvitationByIdPayload) {
      return axiosService.post(`/invitations/private/${payload.invitationId}/accept`)
    },
  }
}

export default invitationService()
