import {ReduxAction} from '../types/reducers'
import Constants from '../constants/popup'

interface State {
    showing: boolean
    content?: Element
}

const initialState: State = {
  showing: false,
}

export function reducePopup (state: State = initialState, action: ReduxAction): State {
  switch (action.type) {
    case Constants.SHOW_POPUP:
      return Object.assign({}, state, {
        showing: true,
        content: action.payload,
      })
    case Constants.CLOSE_POPUP:
      return Object.assign({}, initialState)
    default:
      return state
  }
}
