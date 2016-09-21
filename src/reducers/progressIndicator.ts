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
    case Constants.START_PROGRESS:
      return Object.assign({}, initialState)
    case Constants.INCREMENT_PROGRESS:
      return Object.assign({}, {
        progress: state.progress + 1,
      })
    default:
      return state
  }
}
