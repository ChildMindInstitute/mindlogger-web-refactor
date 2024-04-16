import { LDClient } from 'launchdarkly-react-client-sdk';

import { PROHIBITED_PII_KEYS } from './launchDarkly.const';

let _ldClient: LDClient;
let _userId: string;

export const LaunchDarkly = {
  init(client: LDClient) {
    _ldClient = client;
  },
  login(userId: string) {
    if (!_ldClient) return;
    _userId = userId;
    this.identify({
      userId,
    });
  },
  updateWorkspaces(workspaces: string[]) {
    if (!_userId) return;
    this.identify({
      userId: _userId,
      workspaces,
    });
  },
  identify(context: { userId?: string; workspaces?: string[] }) {
    if (PROHIBITED_PII_KEYS.some((val) => Object.keys(context).includes(val))) {
      throw new Error('Context contains prohibited keys');
    }
    if (!_ldClient) return;
    /**
     * TODO M2-6296:
     * Add segment targeting rules
     *  */
    void _ldClient?.identify(
      {
        ...context,
        kind: 'web-app-users',
        key: `web-app-users-${context.userId}`,
      },
      undefined,
    );
  },
  logout() {
    _userId = '';
    if (!_ldClient) return;
    void _ldClient.identify({
      kind: 'user',
      anonymous: true,
    });
  },
};
