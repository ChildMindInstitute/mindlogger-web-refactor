import {
  AcceptInvitationByIdPayload,
  DeclineInvitationByIdPayload,
  GetInvitationByIdPayload,
  GetInvitationSuccessResponse,
  TransferOwnershipPayload,
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

    acceptTransferOwnership(payload: TransferOwnershipPayload) {
      return axiosService.post(`/applets/${payload.appletId}/transferOwnership/${payload.key}`)
    },
    declineTransferOwnerShip(payload: TransferOwnershipPayload) {
      return axiosService.delete(`/applets/${payload.appletId}/transferOwnership/${payload.key}`)
    },
  }
}

export default invitationService()
