import { useMemo, useReducer } from 'react';

import type { HardwareCategory, HardwareItem } from '@/types/hardware';

type BuildState = Partial<Record<HardwareCategory, HardwareItem>>;

type BuildAction =
  | { type: 'SELECT'; category: HardwareCategory; item: HardwareItem }
  | { type: 'REMOVE'; category: HardwareCategory }
  | { type: 'CLEAR_ALL' }
  | { type: 'LOAD'; state: BuildState };

function reducer(state: BuildState, action: BuildAction): BuildState {
  switch (action.type) {
    case 'SELECT':
      return {
        ...state,
        [action.category]: action.item,
      };
    case 'REMOVE': {
      const next = { ...state };
      delete next[action.category];
      return next;
    }
    case 'CLEAR_ALL':
      return {};
    case 'LOAD':
      return action.state;
    default:
      return state;
  }
}

export function useBuildState() {
  const [state, dispatch] = useReducer(reducer, {});
  const totalPrice = useMemo(
    () => Object.values(state).reduce((sum, item) => sum + (item?.price ?? 0), 0),
    [state]
  );

  return {
    state,
    totalPrice,
    selectItem: (category: HardwareCategory, item: HardwareItem) =>
      dispatch({ type: 'SELECT', category, item }),
    removeItem: (category: HardwareCategory) => dispatch({ type: 'REMOVE', category }),
    clearAll: () => dispatch({ type: 'CLEAR_ALL' }),
    loadState: (nextState: BuildState) => dispatch({ type: 'LOAD', state: nextState }),
  };
}
