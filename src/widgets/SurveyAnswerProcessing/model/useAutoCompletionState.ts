import { useCallback, useReducer } from 'react';

type Status = 'not_started' | 'in_progress' | 'completed';

type SET_ACTIVITIES_COUNT_ACTION = {
  type: 'SET_ACTIVITIES_COUNT';
  payload: number;
};

type INCREMENT_CURRENT_ACTIVITY_INDEX_ACTION = {
  type: 'INCREMENT_CURRENT_ACTIVITY_INDEX';
};

type SET_CURRENT_ACTIVITY_ID_ACTION = {
  type: 'SET_CURRENT_ACTIVITY_ID';
  payload: string;
};

type SET_STATUS_ACTION = {
  type: 'SET_STATUS';
  payload: Status;
};

type Action =
  | SET_ACTIVITIES_COUNT_ACTION
  | INCREMENT_CURRENT_ACTIVITY_INDEX_ACTION
  | SET_CURRENT_ACTIVITY_ID_ACTION
  | SET_STATUS_ACTION;

type State = {
  activitiesCount: number;
  currentActivityIndex: number;

  currentActivityId: string | null;
  status: Status;
};

const initialState: State = {
  activitiesCount: 0,
  currentActivityIndex: 0,
  currentActivityId: null,
  status: 'not_started',
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_ACTIVITIES_COUNT':
      return {
        ...state,
        activitiesCount: action.payload,
      };

    case 'INCREMENT_CURRENT_ACTIVITY_INDEX':
      return {
        ...state,
        currentActivityIndex: state.currentActivityIndex + 1,
      };

    case 'SET_CURRENT_ACTIVITY_ID':
      return {
        ...state,
        currentActivityId: action.payload,
      };

    case 'SET_STATUS':
      return {
        ...state,
        status: action.payload,
      };

    default:
      return state;
  }
};

export const useAutoCompletionState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const incrementActivityIndex = useCallback(() => {
    dispatch({ type: 'INCREMENT_CURRENT_ACTIVITY_INDEX' });
  }, []);

  const setActivitiesCount = useCallback((count: number) => {
    dispatch({ type: 'SET_ACTIVITIES_COUNT', payload: count });
  }, []);

  const setCurrentActivityId = useCallback((value: string) => {
    dispatch({ type: 'SET_CURRENT_ACTIVITY_ID', payload: value });
  }, []);

  const setStatus = useCallback((value: Status) => {
    dispatch({ type: 'SET_STATUS', payload: value });
  }, []);

  return {
    state,
    action: {
      setStatus,
      incrementActivityIndex,
      setActivitiesCount,
      setCurrentActivityId,
    },
  };
};
