import {ReduxAction, ReduxThunk, Dispatch} from '../../types/reducers'
import {TypedValue} from '../../types/utils'
import {OrderBy, Field, Model} from '../../types/types'
import {StateTree} from '../../types/reducers'
import Constants from '../../constants/databrowser/data'
import UiConstants from '../../constants/databrowser/ui'
import * as Immutable from 'immutable'
import {addNode as addRelayNode, queryNodes, updateNode as updateRelayNode} from '../../utils/relay'
import {hideNewRow, setLoading, clearNodeSelection} from './ui'
import {showDonePopup, nextStep} from '../gettingStarted'
import {showNotification} from '../notification'
import {isNonScalarList} from '../../utils/graphql'
import {sideNavSyncer} from '../../utils/sideNavSyncer'

export function setItemCount(count: number) {
  return {
    type: Constants.SET_ITEMCOUNT,
    payload: count,
  }
}

export function setOrder(orderBy: OrderBy): ReduxAction {
  return {
    type: Constants.SET_ORDER,
    payload: orderBy,
  }
}

export function setFilter(fieldName: string, value: TypedValue): ReduxAction {
  return {
    type: Constants.SET_FILTER,
    payload: {
      fieldName,
      value,
    },
  }
}

export function setData(nodes: Immutable.List<Immutable.Map<string, any>>, loaded: Immutable.List<boolean>) {
  return {
    type: Constants.SET_DATA,
    payload: {
      nodes,
      loaded,
    },
  }
}

export function setNodes(nodes: Immutable.List<Immutable.Map<string, any>>, loaded: Immutable.List<boolean>) {
  return {
    type: Constants.SET_NODES,
    payload: nodes,
  }
}

export function setLoaded(loaded: Immutable.List<boolean>) {
  return {
    type: Constants.SET_LOADED,
    payload: loaded,
  }
}

export function setFilterAsync(fieldName: string,
                               value: TypedValue,
                               lokka: any,
                               modelNamePlural: string,
                               fields: Field[],
                               index: number = 0): ReduxThunk {
  return (dispatch: Dispatch, getState: () => StateTree): Promise<{}> => {
    dispatch(setFilter(fieldName, value))
    if (getState().databrowser.ui.selectedNodeIds.size > 0) {
      dispatch(clearNodeSelection())
    }
    return dispatch(reloadDataAsync(lokka, modelNamePlural, fields, index))
  }
}

export function reloadDataAsync(lokka: any, modelNamePlural: string, fields: Field[], index: number = 0): ReduxThunk {
  return (dispatch: Dispatch, getState: () => StateTree): Promise<{}> => {
    dispatch(setData(Immutable.List<Immutable.Map<string, any>>(), Immutable.List<boolean>()))
    return dispatch(loadDataAsync(lokka, modelNamePlural, fields, index, 50))
      .then(() => {
        sideNavSyncer.notifySideNav()
        dispatch(setLoading(false))
      })
  }
}

export function loadDataAsync(lokka: any,
                              modelNamePlural: string,
                              fields: Field[],
                              skip: number,
                              first: number): ReduxThunk {
  return (dispatch: Dispatch, getState: () => StateTree): Promise<{}> => {
    const {data} = getState().databrowser
    return queryNodes(lokka, modelNamePlural, fields, skip, first, data.filter, data.orderBy)
      .then(results => {
        const newNodes = results.viewer[`all${modelNamePlural}`]
          .edges.map(({node}) => {
            // Transforms the relay query into something that the valueparser understands
            // Previously we used the simple API that's why this is necessary
            fields.filter((field) => isNonScalarList(field))
              .forEach(({name}) => node[name] = node[name].edges.map(({node}) => node))
            return node
        }).map(Immutable.Map)

        let nodes = data.nodes
        let loaded = data.loaded
        for (let index = 0; index < newNodes.length; index++) {
          nodes = nodes.set(skip + index, newNodes[index])
          loaded = loaded.set(skip + index, true)
        }

        dispatch(setLoading(false))
        dispatch(setItemCount(results.viewer[`all${modelNamePlural}`].count))
        dispatch(setData(nodes, loaded))
      })
      .catch((err) => {
        err.rawError.forEach(error => dispatch(showNotification({ message: error.message, level: 'error' })))
      })
  }
}

export function addNodeAsync(lokka: any, model: Model, fields: Field[], fieldValues: { [key: string]: any }): ReduxThunk { // tslint:disable-line
  return (dispatch: Dispatch, getState: () => StateTree): Promise<{}> => {
    dispatch(setWriting(true))
    return addRelayNode(lokka, model.name, fieldValues)
      .then(() => dispatch(reloadDataAsync(lokka, model.namePlural, fields)))
      .then(() => {
        const { gettingStartedState } = getState().gettingStarted
        if (model.name === 'Post' && (
          gettingStartedState.isCurrentStep('STEP3_CLICK_ENTER_DESCRIPTION') ||
          gettingStartedState.isCurrentStep('STEP3_CLICK_ADD_NODE1') ||
          gettingStartedState.isCurrentStep('STEP3_CLICK_ADD_NODE2')
        )) {
          dispatch(showDonePopup())
          dispatch(nextStep())
        }
        dispatch(setWriting(false))
        dispatch(hideNewRow())
      })
      .catch((err) => {
        err.rawError.forEach(error => dispatch(showNotification({ message: error.message, level: 'error' })))
      })
  }
}

export function updateNodeAsync(lokka: any,
                                model: Model,
                                fields: Field[],
                                value: TypedValue,
                                field: Field,
                                callback,
                                nodeId: string,
                                index: number): ReduxThunk {
  return (dispatch: Dispatch, getState: () => StateTree): Promise<{}> => {
    const { loaded } = getState().databrowser.data
    dispatch(setWriting(true))
    return updateRelayNode(lokka, model.name, value, field, nodeId)
      .then(() => dispatch(setLoaded(loaded.set(index, false))))
      .then(() => dispatch(loadDataAsync(lokka, model.namePlural, fields, index, 1)))
      .then(() => {
        callback(true)
        dispatch(setWriting(false))
      })
      .catch((err) => {
        callback(false)
        dispatch(setWriting(false))
        err.rawError.forEach((error) => dispatch(showNotification({message: error.message, level: 'error'})))
      })
  }
}

function setWriting(payload: boolean) {
  return {
    type: UiConstants.SET_WRITING,
    payload,
  }
}
