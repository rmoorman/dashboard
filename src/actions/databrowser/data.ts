import {ReduxAction, ReduxThunk, Dispatch} from '../../types/reducers'
import {TypedValue} from '../../types/utils'
import {OrderBy, Field, Model} from '../../types/types'
import {StateTree} from '../../types/reducers'
import Constants from '../../constants/databrowser/data'
import * as Immutable from 'immutable'
import {addNode as addRelayNode, queryNodes, updateNode as updateRelayNode, deleteNode} from '../../utils/relay'
import {hideNewRow, setLoading, clearNodeSelection} from './ui'
import {showDonePopup, nextStep} from '../gettingStarted'
import {showNotification} from '../notification'
import {isNonScalarList} from '../../utils/graphql'
import {sideNavSyncer} from '../../utils/sideNavSyncer'
import * as bluebird from 'bluebird'
import {GridPosition} from '../../types/databrowser/ui'

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

export function setNodes(nodes: Immutable.List<Immutable.Map<string, any>>) {
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
    // as we have optimistic ui updates, they trigger an unwanted reload to the InfiniteLoader
    // so disable loading while doing the mutations
    if (data.mutationActive) {
      return Promise.reject({})
    }
    return queryNodes(lokka, modelNamePlural, fields, skip, first, data.searchQuery, data.orderBy)
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
    dispatch(mutationRequest())

    dispatch(hideNewRow())

    const values = Object.keys(fieldValues).mapToObject(key => key, key => fieldValues[key].value)

    dispatch(addNodeRequest(Immutable.Map<string, any>(values)))

    return addRelayNode(lokka, model.name, fieldValues, fields)
      .then(res => {
        const node = res[`create${model.name}`][lowercaseFirstLetter(model.name)]
        dispatch(addNodeSuccess(Immutable.Map<string,any>(node)))
        dispatch(mutationSuccess())

        const { gettingStartedState } = getState().gettingStarted
        if (model.name === 'Post' && (
            gettingStartedState.isCurrentStep('STEP3_CLICK_ENTER_DESCRIPTION') ||
            gettingStartedState.isCurrentStep('STEP3_CLICK_ADD_NODE1') ||
            gettingStartedState.isCurrentStep('STEP3_CLICK_ADD_NODE2')
          )) {
          dispatch(showDonePopup())
          dispatch(nextStep())
        }
      })
      .catch((err) => {
        dispatch(mutationError())
        err.rawError.forEach(error => dispatch(showNotification({ message: error.message, level: 'error' })))
      })
  }
}

function lowercaseFirstLetter(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1)
}

export function updateNodeAsync(lokka: any,
                                model: Model,
                                fields: Field[],
                                value: TypedValue,
                                field: Field,
                                callback,
                                nodeId: string,
                                rowIndex: number): ReduxThunk {
  return (dispatch: Dispatch, getState: () => StateTree): Promise<{}> => {
    dispatch(mutationRequest())
    dispatch(updateCell({
      position: {
        row: rowIndex,
        field: field.name,
      },
      value,
    }))
    return updateRelayNode(lokka, model.name, value, field, nodeId)
      .then(() => {
        dispatch(mutationSuccess())
        callback(true)
      })
      .catch((err) => {
        dispatch(mutationError())
        callback(false)
        err.rawError.forEach((error) => dispatch(showNotification({message: error.message, level: 'error'})))
      })
  }
}

export function deleteSelectedNodes(lokka: any, projectName: string, modelName: string): ReduxThunk {
  return (dispatch, getState) => {
    const { selectedNodeIds } = getState().databrowser.ui
    const ids = selectedNodeIds.toArray()

    dispatch(mutationRequest())
    dispatch(deleteNodes(ids))
    dispatch(clearNodeSelection())

    bluebird.map(ids, id => deleteNode(lokka, modelName, id), {
      concurrency: 5,
    })
      .then(() => {
        analytics.track('models/browser: deleted node', {
          project: projectName,
          model: modelName,
        })
        dispatch(mutationSuccess())
      })
      .catch((err) => {
        dispatch(mutationError())
        err.rawError.forEach((error) => this.props.showNotification({message: error.message, level: 'error'}))
      })

  }
}

export function search(e: any, lokka: any, modelNamePlural: string, fields: Field[], index: number = 0): ReduxThunk {
  return (dispatch) => {
    const value = e.target.value
    dispatch(setSearchQuery(value))
    dispatch(reloadDataAsync(lokka, modelNamePlural, fields, index))
  }
}

export function updateCell(payload: {
  position: GridPosition,
  value: TypedValue
}) {
  return {
    type: Constants.UPDATE_CELL,
    payload,
  }
}

export function mutationSuccess() {
  return {
    type: Constants.MUTATION_SUCCESS,
  }
}

export function mutationError() {
  return {
    type: Constants.MUTATION_ERROR,
  }
}

export function mutationRequest() {
  return {
    type: Constants.MUTATION_REQUEST,
  }
}

export function addNodeRequest(payload: Immutable.Map<string,any>) {
  return {
    type: Constants.ADD_NODE_REQUEST,
    payload,
  }
}

export function addNodeSuccess(payload: Immutable.Map<string,any>) {
  return {
    type: Constants.ADD_NODE_SUCCESS,
    payload,
  }
}

export function deleteNodes(payload: string[]) {
  return {
    type: Constants.DELETE_NODES,
    payload,
  }
}

export function setSearchQuery(payload: string) {
  return {
    type: Constants.SET_SEARCH_QUERY,
    payload,
  }
}
