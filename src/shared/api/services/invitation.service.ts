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
      return axiosService.get(`/invitations/approve/${payload.invitationId}`)
    },
    declineInvitation(payload: DeclineInvitationByIdPayload) {
      return axiosService.delete(`/invitations/decline/${payload.invitationId}`)
    },
  }
}

export default invitationService()
