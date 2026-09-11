import { SESSION_ENDED_KEY } from './session.const';

let hasEnded: boolean | null = null;

// Read once and cleared, so the note turns away the boot it was left for and not the ones after it.
// The answer is held for the rest of the boot: flipping mid-render would take the tab into the very
// session it is meant to be offering a choice about.
export const consumeSessionEnded = () => {
  if (hasEnded === null) {
    hasEnded = !!sessionStorage.getItem(SESSION_ENDED_KEY);
    sessionStorage.removeItem(SESSION_ENDED_KEY);
  }

  return hasEnded;
};

// Signing in answers the note, so it stops turning this boot away too. Reading again re-reads
// storage, which the line below has emptied.
export const clearSessionEnded = () => {
  hasEnded = null;
  sessionStorage.removeItem(SESSION_ENDED_KEY);
};

// A tab that slept through a logout and someone else signing in holds a snapshot of a session that
// has ended. It cannot tear down, because the shared store it would clear — tokens, the encryption
// key, the persisted answers — belongs to whoever signed in after it. Nor can it stay: everything on
// screen is the old user's. So it drops what is its own and reloads, leaving a note for the boot on
// the way back in.
export const leaveEndedSession = () => {
  // Per tab, so clearing it takes nothing from the live session. It survives a reload, which is why
  // the state of a session that has ended has to be dropped here rather than left to the reload.
  sessionStorage.clear();

  // Set after the clear, and read on the way back in. Without it the reload would read the tokens
  // the browser now holds and walk straight into a session this tab was never signed in to.
  sessionStorage.setItem(SESSION_ENDED_KEY, 'true');

  window.location.reload();
};
