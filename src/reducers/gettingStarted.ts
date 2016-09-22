import { ReduxAction } from '../types/reducers'
import Constants from '../constants/gettingStarted'
import { GettingStartedState } from './../types/gettingStarted'

interface State {
  checkStatus: boolean,
  gettingStartedState?: GettingStartedState
}

const initialState: State = {checkStatus: false}

export function reduceGettingStartedState (state: State = initialState, action: ReduxAction): State {
  switch (action.type) {
    case Constants.UPDATE:
      const gettingStartedState = action.payload.gettingStartedState

      // TODO: use reselect for derived data
      return Object.assign({}, state, {
        gettingStartedState,
        checkStatus: gettingStartedState.isCurrentStep('STEP9_WAITING_FOR_REQUESTS'),
      })
    default:
      return state
  }
}
