import { render } from '@testing-library/react';

import LogoutTracker from './index';

import { eventEmitter } from '~/shared/utils';

const logout = vi.fn();

vi.mock('~/features/Logout', () => ({ useLogout: () => ({ logout, isLoading: false }) }));

const renderTracker = () =>
  render(
    <LogoutTracker>
      <div />
    </LogoutTracker>,
  );

describe('LogoutTracker', () => {
  beforeEach(() => vi.clearAllMocks());

  // The only thing that emits this is the token refresh failing, which is the session ending on
  // its own. Called as a manual logout, it would send the user back to the applet list.
  it('ends the session as one that ran out rather than one the user left', () => {
    renderTracker();

    eventEmitter.emit('onLogout');

    expect(logout).toHaveBeenCalledWith({ reason: 'refresh-failed' });
  });

  // The emitter hands its listeners a payload, which passed straight through would arrive as the
  // options and could carry anything at all into the teardown.
  it('keeps the emitted payload out of the logout options', () => {
    renderTracker();

    eventEmitter.emit('onLogout', { isRemote: true });

    expect(logout).toHaveBeenCalledWith({ reason: 'refresh-failed' });
  });

  it('stops listening once it is gone', () => {
    renderTracker().unmount();

    eventEmitter.emit('onLogout');

    expect(logout).not.toHaveBeenCalled();
  });
});
