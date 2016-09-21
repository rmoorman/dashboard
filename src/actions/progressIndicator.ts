import { ReduxAction } from '../types/reducers'
import Constants from '../constants/progressIndicator'

export function updateProgress(progress: number): ReduxAction {
  return {
    type: Constants.UPDATE_PROGRESS,
    payload: progress,
  }
}
