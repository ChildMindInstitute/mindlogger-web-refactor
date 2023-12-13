import { createMigrate, MigrationManifest } from "redux-persist"

import { RootState } from "~/shared/utils"

const NODE_ENV = import.meta.env.NODE_ENV

const isDev = NODE_ENV === "development"

interface Migrations {
  [key: string]: (state: MigrationState) => MigrationState
}

type MigrationState = RootStateV0 | RootStateV1

type AppletsStateV0 = Omit<RootState["activity"], "consents">
type RootStateV0 = Omit<RootState, "activity"> & {
  activity: AppletsStateV0
}

type RootStateV1 = RootState

const migrations: Migrations = {
  0: (state: RootStateV0): RootStateV1 => {
    return {
      ...state,
      activity: {
        ...state.activity,
        consents: {},
      },
    }
  },
}

export const migrate = createMigrate(migrations as unknown as MigrationManifest, {
  debug: isDev,
})
