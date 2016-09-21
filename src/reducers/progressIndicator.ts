import {ReduxAction} from '../types/reducers'
import Constants from '../constants/progressIndicator'

interface State {
    progress: number
}

const initialState: State = {
  progress: 0,
}

export function reduceProgress (state: State = initialState, action: ReduxAction): State {
  switch (action.type) {
    case Constants.UPDATE_PROGRESS:
      return Object.assign({}, state, {
        progress: action.payload,
      })
    default:
      return state
  }
}
