import type { APIRequestContext } from '@playwright/test';

export class AppletsApi {
  constructor(private readonly api: APIRequestContext) {}

  async createManagerInvite(inviteData: { email: string; firstName: string; lastName: string; language: string; role: string; workspacePrefix: string; title: string; }, appletID: string): Promise<any> {
    const res = await this.api.post(`/invitations/${appletID}/managers`, { data: inviteData });
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`createManagerInvite failed: ${res.status()} ${res.statusText()} - ${text}`);
    }
    return res.json();
  }

  async getAppletInvitations(appletID: string): Promise<any> {
    const res = await this.api.get(`/invitations?page=1&limit=10&ordering=-id&appletId=${appletID}`);
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`getAppletInvitations failed: ${res.status()} ${res.statusText()} - ${text}`);
    }
    return res.json();
  }
}
