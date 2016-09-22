import {ReduxAction} from '../types/reducers'
import Constants from '../constants/popup'

export function showPopup(element: JSX.Element, id: string): ReduxAction {
    return {
        type: Constants.SHOW_POPUP,
        payload: {
            element,
            id,
        },
    }
}

export function closePopup(id?: string): ReduxAction {
    return {
        type: Constants.CLOSE_POPUP,
        payload: id,
    }
}
