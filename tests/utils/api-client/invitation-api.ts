import crypto from 'node:crypto';

import { CuriousApi } from './api';

export class InvitationAPI extends CuriousApi {
  // Owner invites a user as respondent; returns the invitation key.
  async inviteRespondent(
    appletId: string,
    invitee: { email: string; firstName: string; lastName: string },
  ): Promise<string> {
    const response = await this.apiContext.post(`/invitations/${appletId}/respondent`, {
      data: {
        email: invitee.email,
        firstName: invitee.firstName,
        lastName: invitee.lastName,
        language: 'en',
        secretUserId: crypto.randomUUID(),
      },
    });
    if (!response.ok()) {
      throw new Error(`Failed to invite respondent: ${response.status()} ${await response.text()}`);
    }
    return (await response.json()).result.key;
  }

  // Called with the invitee's own auth context.
  async acceptInvite(key: string): Promise<void> {
    const response = await this.apiContext.post(`/invitations/${key}/accept`);
    if (!response.ok()) {
      throw new Error(`Failed to accept invite: ${response.status()} ${await response.text()}`);
    }
  }
}
