import {ReduxAction} from '../types/reducers'
import Constants from '../constants/popup'
import {Popup} from '../types/popup'
import * as Immutable from 'immutable'

interface State {
  popups: Immutable.List<Popup>
}

const initialState: State = {
  popups: Immutable.List<Popup>(),
}

export function reducePopup (state: State = initialState, action: ReduxAction): State {
  switch (action.type) {
    case Constants.SHOW_POPUP:
      return {
        popups: state.popups.push(action.payload),
      }
    case Constants.CLOSE_POPUP:
      if (!action.payload) {
        return {
          popups: state.popups.pop(),
        }
      }
      return {
        popups: state.popups.filter(value => value.id !== action.payload).toList(),
      }
    default:
      return state
  }
}
