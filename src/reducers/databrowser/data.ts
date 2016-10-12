import {ReduxAction} from '../../types/reducers'
import Constants from '../../constants/databrowser/data'
import SharedConstants from '../../constants/databrowser/shared'
import * as Immutable from 'immutable'
import {DataBrowserDataState} from '../../types/databrowser/data'

const initialState: DataBrowserDataState =  {
  nodes: Immutable.List<Immutable.Map<string, any>>(),
  oldNodes: Immutable.List<Immutable.Map<string, any>>(),
  orderBy: {
    fieldName: 'id',
    order: 'DESC',
  },
  filter: Immutable.Map<string, any>(),
  itemCount: 0,
  loaded: Immutable.List<boolean>(),
  mutationActive: false
}

export function reduceData(state: DataBrowserDataState = initialState, action: ReduxAction): DataBrowserDataState {
  switch (action.type) {
    case Constants.SET_ORDER:
      return Object.assign({}, state, { orderBy: action.payload })
    case Constants.SET_FILTER:
      const {fieldName, value} = action.payload
      return Object.assign({}, state, {
        filter: state.filter.set(fieldName, value)
      })
    case Constants.SET_ITEMCOUNT:
      return Object.assign({}, state, {
        itemCount: action.payload,
      })
    case Constants.SET_DATA:
      const {nodes, loaded} = action.payload
      return Object.assign({}, state, {
        nodes,
        loaded,
      })
    case Constants.SET_NODES:
      return Object.assign({}, state, {
        nodes: action.payload,
      })
    case Constants.SET_LOADED:
      return Object.assign({}, state, {
        loaded: action.payload,
      })
    case Constants.MUTATION_REQUEST:
      return Object.assign({}, state, {
        oldNodes: state.nodes,
        mutationActive: true,
      })
    case Constants.MUTATION_ERROR:
      return Object.assign({}, state, {
        nodes: state.oldNodes,
        mutationActive: false,
      })
    case Constants.MUTATION_SUCCESS:
      return Object.assign({}, state, {
        mutationActive: false,
      })
    case Constants.ADD_NODE_REQUEST:
      return Object.assign({}, state, {
        nodes: state.nodes.unshift(action.payload),
        itemCount: state.itemCount + 1,
      })
    case Constants.ADD_NODE_SUCCESS:
      return Object.assign({}, state, {
        nodes: state.nodes.set(0, action.payload),
      })
    case Constants.DELETE_NODES:
      return Object.assign({}, state, {
        nodes: state.nodes.takeWhile((node, index) => action.payload.indexOf(index) === -1),
      })
    case Constants.SET_CELL:
      // use block as we would redefine `value` in the same block again
      const { position } = action.payload
      const cellValue = action.payload.value
      return Object.assign({}, state, {
        nodes: state.nodes.setIn([position.row, position.field], cellValue),
      })
    case SharedConstants.RESET:
      return initialState
  }
  return state
}
