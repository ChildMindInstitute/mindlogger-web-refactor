export const EVENTS = {
  onTokensChange: "ON_TOKENS_CHANGE",
  onLogout: "ON_LOGOUT",
} as const

type Events = keyof typeof EVENTS

class EventEmitter {
  private _events: Record<Events, Array<() => void>>

  constructor() {
    this._events = {
      onTokensChange: [],
      onLogout: [],
    }
  }

  public on(name: Events, listener: () => void) {
    if (!this._events[name]) {
      this._events[name] = []
    }

    this._events[name].push(listener)
  }

  public off(name: Events, listenerToRemove: () => void) {
    if (!this._events[name]) {
      throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`)
    }

    const filterListeners = (listener: () => void) => listener !== listenerToRemove

    this._events[name] = this._events[name].filter(filterListeners)
  }

  public emit(name: Events, data?: Record<string, unknown>) {
    if (!this._events[name]) {
      throw new Error(`Can't emit an event. Event "${name}" doesn't exits.`)
    }

    const fireCallbacks = (callback: (data?: Record<string, unknown>) => void) => {
      callback(data)
    }

    this._events[name].forEach(fireCallbacks)
  }
}

export const eventEmitter = new EventEmitter()
