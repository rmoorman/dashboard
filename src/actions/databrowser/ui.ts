import Constants from '../../constants/databrowser/ui'
import * as Immutable from 'immutable'
import {ReduxAction} from '../../types/reducers'
import {Field} from '../../types/types'
import {nextStep} from '../gettingStarted'

export function hideNewRow(): ReduxAction {
  return {
    type: Constants.HIDE_NEW_ROW,
  }
}

export function toggleNewRow(fields: Field[]) {
  return (dispatch, getState) => {
    const { newRowActive } = getState().databrowser.ui
    const { step } = getState().gettingStarted.gettingStartedState

    // if we're activating the new row, also select the first field
    if (!newRowActive && fields) {
      const firstNonReadonlyField = getFirstNonReadonlyField(fields)
      dispatch(selectCell([-1, firstNonReadonlyField.name]))

      if (step === 'STEP3_CLICK_ADD_NODE1') {
        dispatch(nextStep())
      }
    }

    dispatch({
      type: Constants.TOGGLE_NEW_ROW,
    })
  }
}

function getFirstNonReadonlyField(fields: Field[]) {
  for (let i = 0; i < fields.length; i++) {
    if (!fields[i].isReadonly) {
      return fields[i]
    }
  }

  return fields[0]
}

export function setNodeSelection(ids: Immutable.List<string>): ReduxAction {
  return {
    type: Constants.SET_NODE_SELECTION,
    payload: ids,
  }
}

export function clearNodeSelection(): ReduxAction {
  return {
    type: Constants.CLEAR_NODE_SELECTION,
  }
}

export function toggleNodeSelection(id: string) {
  return {
    type: Constants.TOGGLE_NODE_SELECTION,
    payload: id,
  }
}

export function setScrollTop(scrollTop: number) {
  return {
    type: Constants.SET_SCROLL_TOP,
    payload: scrollTop,
  }
}

export function setLoading(loading: boolean) {
  return {
    type: Constants.SET_LOADING,
    payload: loading,
  }
}

export function toggleFilter(): ReduxAction {
  return {
    type: Constants.TOGGLE_FILTER,
  }
}

export function selectCell(position: [number, string]) {
  return {
    type: Constants.SELECT_CELL,
    payload: position,
  }
}

export function unselectCell() {
  return {
    type: Constants.UNSELECT_CELL,
  }
}

export function editCell(position: [number, string]) {
  console.log('editCell', position)
  return {
    type: Constants.EDIT_CELL,
    payload: position,
  }
}

export function stopEditCell() {
  return (dispatch, getState) => {

    const { browserViewRef } = getState().databrowser.ui

    if (browserViewRef !== null) {
      browserViewRef.focus()
      browserViewRef.click()
    }

    dispatch({
      type: Constants.STOP_EDIT_CELL,
    })
  }
}

export function setBrowserViewRef(ref: any) {
  return {
    type: Constants.SET_BROWSER_VIEW_REF,
    payload: ref,
  }
}

export function nextCell(fields: Field[]) {
  return (dispatch, getState) => {
    if (!fields) {
      return
    }
    const { selectedCell, newRowActive } = getState().databrowser.ui
    const { nodes } = getState().databrowser.data

    const i = fields.map(f => f.name).indexOf(selectedCell[1])

    if (i === fields.length - 1) {
      // last in the row, so go to first of next row
      dispatch(selectCell([((selectedCell[0] + (newRowActive ? 0 : 1)) % nodes.size), fields[0].name]))
    } else {
      dispatch(selectCell([selectedCell[0], fields[i + 1].name]))
    }
  }
}

export function previousCell(fields: Field[]) {
  return (dispatch, getState) => {
    if (!fields) {
      return
    }
    const { selectedCell, newRowActive } = getState().databrowser.ui
    const { nodes } = getState().databrowser.data

    const i = fields.map(f => f.name).indexOf(selectedCell[1])

    if (i === 0) {
      // last in the row, so go to last of prev row
      dispatch(selectCell([((selectedCell[0] + (newRowActive ? 0 : (nodes.size - 1))) % nodes.size),
        fields[fields.length - 1].name]))
    } else {
      dispatch(selectCell([selectedCell[0], fields[i - 1].name]))
    }
  }
}

export function nextRow(fields: Field[]) {
  return (dispatch, getState) => {
    if (!fields) {
      return
    }
    const { selectedCell, newRowActive } = getState().databrowser.ui
    const { nodes } = getState().databrowser.data

    if (newRowActive) {
      return
    }

    dispatch(selectCell([((selectedCell[0] + 1) % nodes.size), selectedCell[1]]))
  }
}

export function previousRow(fields: Field[]) {
  return (dispatch, getState) => {
    if (!fields) {
      return
    }
    const { selectedCell, newRowActive } = getState().databrowser.ui
    const { nodes } = getState().databrowser.data

    if (newRowActive) {
      return
    }

    dispatch(selectCell([((selectedCell[0] - 1 + nodes.size) % nodes.size), selectedCell[1]]))
  }
}
