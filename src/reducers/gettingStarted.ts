import {ReduxAction} from '../types/reducers'
import Constants from '../constants/gettingStarted'
import {GettingStartedState} from './../types/gettingStarted'

interface State {
  poll: boolean,
  gettingStartedState?: GettingStartedState
}

const initialState: State = {poll: false}

export function reduceGettingStartedState(state: State = initialState, action: ReduxAction): State {
  switch (action.type) {
    case Constants.UPDATE:
      const gettingStartedState = action.payload.gettingStartedState

      // TODO: use reselect for derived data
      return Object.assign({}, state, {
        gettingStartedState,
        poll: gettingStartedState.isCurrentStep('STEP5_WAITING'),
      })
    default:
      return state
  }
}
