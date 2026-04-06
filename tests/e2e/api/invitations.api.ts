import type { APIRequestContext } from '@playwright/test';
import type {
  AcceptInvitationByIdPayload,
  DeclineInvitationByIdPayload,
  GetInvitationByIdPayload,
  GetInvitationSuccessResponse,
} from '../../../src/shared/api/types/invitation';

export class InvitationsApi {
  constructor(private readonly api: APIRequestContext) {}

  async getInvitation(invitationId: string): Promise<GetInvitationSuccessResponse> {
    const res = await this.api.get(`/invitations/${invitationId}`);
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`getInvitation failed: ${res.status()} ${res.statusText()} - ${text}`);
    }
    return res.json() as Promise<GetInvitationSuccessResponse>;
  }

  async acceptInvitation(invitationId: string): Promise<void> {
    const payload: AcceptInvitationByIdPayload = { invitationId };
    const res = await this.api.post(`/invitations/${payload.invitationId}/accept`);
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`acceptInvitation failed: ${res.status()} ${res.statusText()} - ${text}`);
    }
  }

  async declineInvitation(invitationId: string): Promise<void> {
    const payload: DeclineInvitationByIdPayload = { invitationId };
    const res = await this.api.delete(`/invitations/${payload.invitationId}/decline`);
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`declineInvitation failed: ${res.status()} ${res.statusText()} - ${text}`);
    }
  }

  async getPrivateInvitation(invitationId: string): Promise<GetInvitationSuccessResponse> {
    const res = await this.api.get(`/invitations/private/${invitationId}`);
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`getPrivateInvitation failed: ${res.status()} ${res.statusText()} - ${text}`);
    }
    return res.json() as Promise<GetInvitationSuccessResponse>;
  }

  async acceptPrivateInvitation(invitationId: string): Promise<void> {
    const payload: AcceptInvitationByIdPayload = { invitationId };
    const res = await this.api.post(`/invitations/private/${payload.invitationId}/accept`);
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`acceptPrivateInvitation failed: ${res.status()} ${res.statusText()} - ${text}`);
    }
  }
}
