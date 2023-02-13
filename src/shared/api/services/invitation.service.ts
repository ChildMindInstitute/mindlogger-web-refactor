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
  }
}

export default invitationService()
