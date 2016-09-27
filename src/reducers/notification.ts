import { ReduxAction } from '../types/reducers'
import Constants from '../constants/notification'
import { NotificationLevel } from '../types/utils'

interface State {
  message: string
  level: NotificationLevel
}

const initialState: State = {
  message: null,
  level: null,
}

export function reduceNotification(state: State = initialState, action: ReduxAction): State {
  switch (action.type) {
    case Constants.SHOW_NOTIFICATION:
      return {
        message: action.payload.message,
        level: action.payload.level,
      }
    case Constants.CLEAR_NOTIFICATION:
      return {
        message: null,
        level: null,
      }
    default:
      return state
  }
}
