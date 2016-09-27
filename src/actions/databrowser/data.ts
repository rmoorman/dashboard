import {ReduxAction} from '../../types/reducers'
import {TypedValue} from '../../types/utils'
import {Field} from '../../types/types'
import Constants from '../../constants/databrowser/data'

export function loadData(): ReduxAction {
  return {
    type: Constants.QUERY,
  }
}

export function addNode(modelName: string, fieldValues: { [key: string]: any }): ReduxAction {
  return {
    type: Constants.ADD_NODE,
    payload: {
      fieldValues,
      modelName,
    },
  }
}

export function addNodes(): ReduxAction {
  return {
    type: Constants.ADD_NODES,
  }
}

export function updateNode(value: TypedValue, field: Field, nodeId: string, index: number): ReduxAction {
  return {
    type: Constants.UPDATE_NODE,
    payload: {
      value,
      field,
      nodeId,
      index,
    },
  }
}

export function deleteNode(modelName: string, id: string): ReduxAction {
  return {
    type: Constants.DELETE_NODE,
    payload: {
      modelName,
      id,
    },
  }
}
