import {CuriousApi} from "./api";
import type {
  GetInvitationSuccessResponse,
} from '../../../src/shared/api/types/invitation';

/**
 * API helper for invitation lifecycle operations.
 */
export class InvitationsAPI extends CuriousApi {
  /**
   * Fetch the invitation details for a given invitation ID.
   *
   * @param invitationId - The invitation identifier.
   * @returns The invitation response object.
   */
  async getInvitation(invitationId: string): Promise<GetInvitationSuccessResponse> {
    const res = await this.apiContext.get(`/invitations/${invitationId}`);
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`getInvitation failed: ${res.status()} ${res.statusText()} - ${text}`);
    }
    return res.json() as Promise<GetInvitationSuccessResponse>;
  }

  /**
   * Accept an invitation by ID.
   *
   * @param invitationId - The invitation identifier.
   */
  async acceptInvitation(invitationId: string): Promise<void> {
    const res = await this.apiContext.post(`/invitations/${invitationId}/accept`);
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`acceptInvitation failed: ${res.status()} ${res.statusText()} - ${text}`);
    }
  }

  /**
   * Decline an invitation by ID.
   *
   * @param invitationId - The invitation identifier.
   */
  async declineInvitation(invitationId: string): Promise<void> {
    const res = await this.apiContext.post(`/invitations/${invitationId}/decline`);
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`declineInvitation failed: ${res.status()} ${res.statusText()} - ${text}`);
    }
  }
}