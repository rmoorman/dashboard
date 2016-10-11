import Constants from '../../constants/databrowser/ui'
import * as Immutable from 'immutable'
import {ReduxAction, ReduxThunk} from '../../types/reducers'
import {Field} from '../../types/types'
import {nextStep} from '../gettingStarted'
import {GridPosition} from '../../types/databrowser/ui'

export function hideNewRow(): ReduxAction {
  return {
    type: Constants.HIDE_NEW_ROW,
  }
}

export function toggleNewRow(fields: Field[]): ReduxThunk {
  return (dispatch, getState) => {
    const { newRowActive } = getState().databrowser.ui
    const { step } = getState().gettingStarted.gettingStartedState

    // if we're activating the new row, also select the first field
    if (!newRowActive && fields) {
      const firstNonReadonlyField = getFirstNonReadonlyField(fields)
      dispatch(selectCell({
        row: -1,
        field: firstNonReadonlyField.name,
      }))

      if (step === 'STEP3_CLICK_ADD_NODE1') {
        dispatch(nextStep())
      }
    }

    dispatch({
      type: Constants.TOGGLE_NEW_ROW,
    })
  }
}

function getFirstNonReadonlyField(fields: Field[]): Field {
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

export function toggleNodeSelection(id: string): ReduxAction {
  return {
    type: Constants.TOGGLE_NODE_SELECTION,
    payload: id,
  }
}

export function setScrollTop(scrollTop: number): ReduxAction {
  return {
    type: Constants.SET_SCROLL_TOP,
    payload: scrollTop,
  }
}

export function setLoading(loading: boolean): ReduxAction {
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

export function selectCell(position: GridPosition): ReduxAction {
  return {
    type: Constants.SELECT_CELL,
    payload: position,
  }
}

export function unselectCell(): ReduxAction {
  return {
    type: Constants.UNSELECT_CELL,
  }
}

export function editCell(position: GridPosition): ReduxAction {
  return {
    type: Constants.EDIT_CELL,
    payload: position,
  }
}

export function stopEditCell(): ReduxThunk {
  return (dispatch, getState) => {

    const { browserViewRef } = getState().databrowser.ui

    if (browserViewRef !== null) {
      browserViewRef.focus()
    }

    dispatch({
      type: Constants.STOP_EDIT_CELL,
    })
  }
}

export function setBrowserViewRef(ref: any): ReduxAction {
  return {
    type: Constants.SET_BROWSER_VIEW_REF,
    payload: ref,
  }
}

export function nextCell(fields: Field[]): ReduxThunk {
  return (dispatch, getState) => {
    if (!fields) {
      return
    }
    const { selectedCell, newRowActive } = getState().databrowser.ui
    const { nodes } = getState().databrowser.data

    const i = fields.map(f => f.name).indexOf(selectedCell.field)

    if (i === fields.length - 1) {
      // last in the row, so go to first of next row
      dispatch(selectCell({
        row: ((selectedCell.row + (newRowActive ? 0 : 1)) % nodes.size),
        field: fields[0].name,
      }))
    } else {
      dispatch(selectCell({
        row: selectedCell.row,
        field: fields[i + 1].name,
      }))
    }
  }
}

export function previousCell(fields: Field[]): ReduxThunk {
  return (dispatch, getState) => {
    if (!fields) {
      return
    }
    const { selectedCell, newRowActive } = getState().databrowser.ui
    const { nodes } = getState().databrowser.data

    const i = fields.map(f => f.name).indexOf(selectedCell.field)

    if (i === 0) {
      // last in the row, so go to last of prev row
      dispatch(selectCell({
        row: selectedCell.row + (newRowActive ? 0 : (nodes.size - 1)) % nodes.size,
        field: fields[fields.length - 1].name,
      }))
    } else {
      dispatch(selectCell({
        row: selectedCell.row,
        field: fields[i - 1].name,
      }))
    }
  }
}

export function nextRow(fields: Field[]): ReduxThunk {
  return (dispatch, getState) => {
    if (!fields) {
      return
    }
    const { selectedCell, newRowActive } = getState().databrowser.ui
    const { nodes } = getState().databrowser.data

    const rowIndex: number = ((selectedCell.row + 1 + 1) % (nodes.size + 1)) - 1

    if (rowIndex === -1 && !newRowActive) {
      dispatch(toggleNewRow(fields))
    }

    dispatch(selectCell({
      row: rowIndex,
      field: selectedCell.field,
    }))
  }
}

export function previousRow(fields: Field[]): ReduxThunk {
  return (dispatch, getState) => {
    if (!fields) {
      return
    }
    const { selectedCell, newRowActive } = getState().databrowser.ui
    const { nodes } = getState().databrowser.data

    const rowIndex = ((selectedCell.row - 1 + 1 + nodes.size) % nodes.size) - 1

    if (rowIndex === -1 && !newRowActive) {
      dispatch(toggleNewRow(fields))
    }

    dispatch(selectCell({
      row: rowIndex,
      field: selectedCell.field,
    }))
  }
}
