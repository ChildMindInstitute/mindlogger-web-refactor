import { GetInvitationSuccessResponse } from "../types/invitation"
import axiosService from "./axios"

function invitationService() {
  return {
    getInvitationById(id: string) {
      return axiosService.get<GetInvitationSuccessResponse>(`/invitations/${id}`)
    },
    acceptInvitation(id: string) {
      return axiosService.get(`/invitations/approve/${id}`)
    },
    declineInvitation(id: string) {
      return axiosService.delete(`/invitations/decline/${id}`)
    },
  }
}

export default invitationService()
