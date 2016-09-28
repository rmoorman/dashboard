import {ReduxAction, ReduxThunk, Dispatch} from '../../types/reducers'
import {TypedValue} from '../../types/utils'
import {Field, OrderBy} from '../../types/types'
import Constants from '../../constants/databrowser/data'
import {queryNodes} from '../../utils/relay'

export function setItemCount(count: number) {
  return {
    type: Constants.SET_ITEMCOUNT,
    payload: count,
  }
}

export function setOrder(orderBy: OrderBy) {
  return {
    type: Constants.SET_ORDER,
    payload: orderBy,
  }
}

export function setFilter(fieldName: string, value: TypedValue) {
  return {
    type: Constants.SET_FILTER,
    payload: {
      fieldName,
      value,
    },
  }
}

export function loadData(lokka: any, modelNamePlural: string, fields: Field[]): ReduxThunk {
  return (dispatch: Dispatch): Promise<{}> => {
    return queryNodes(lokka, modelNamePlural, fields, )
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
