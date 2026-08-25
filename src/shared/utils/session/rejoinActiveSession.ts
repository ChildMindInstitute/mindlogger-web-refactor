// A tab that slept through a logout and someone else signing in holds a snapshot of a session that
// has ended. It cannot tear down, because the shared store it would clear — tokens, the encryption
// key, the persisted answers — belongs to whoever signed in after it. Dropping what is its own and
// reloading is the only way to reach the live session: tokens are read from a snapshot taken at
// load, so nothing short of a reload can refresh it.
export const rejoinActiveSession = () => {
  // Per tab, so clearing it takes nothing from the live session. It survives a reload, which is
  // why the state of a session that has ended has to be dropped here rather than left to the
  // reload below.
  sessionStorage.clear();

  // No loop to guard against: the reload reads the tokens the browser actually holds, so the tab
  // comes back owning the session it just failed to match.
  window.location.reload();
};
