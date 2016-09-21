import {ReduxAction} from '../types/reducers'
import Constants from '../constants/popup'

export function showPopup(payload: any): ReduxAction {
    return {
        type: Constants.SHOW_POPUP,
        payload: payload,
    }
}

export function closePopup(payload: any): ReduxAction {
    return {
        type: Constants.CLOSE_POPUP,
    }
}
