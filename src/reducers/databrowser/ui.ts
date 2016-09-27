import {ReduxAction} from '../../types/reducers'
import Constants from '../../constants/databrowser/ui'
import * as Immutable from 'immutable'

interface State {
  filtersVisible: boolean
  newRowVisible: boolean
  selectedNodeIds: Immutable.List<string>
  scrollTop: number
  loading: boolean
}

const initialState: State = {
  filtersVisible: false,
  newRowVisible: false,
  selectedNodeIds: Immutable.List<string>(),
  scrollTop: 0,
  loading: true,
}

export function reduceUI(state: State = initialState, action: ReduxAction) {
  switch (action.type) {
    case Constants.HIDE_NEW_ROW:
      return Object.assign({}, state, { newRowVisible: false })
    case Constants.TOGGLE_NEW_ROW:
      return Object.assign({}, state, { newRowVisible: !state.newRowVisible })
    case Constants.TOGGLE_FILTER:
      return Object.assign({}, state, { filtersVisible: !state.filtersVisible })
    case Constants.SET_NODE_SELECTION:
      return Object.assign({}, state, { selectedNodeIds: action.payload })
    case Constants.CLEAR_NODE_SELECTION:
      return Object.assign({}, state, { selectedNodeIds: Immutable.List<string>() })
    case Constants.TOGGLE_NODE_SELECTION:
      const id = action.payload
      if (state.selectedNodeIds.includes(id)) {
        return Object.assign({}, state, { selectedNodeIds: state.selectedNodeIds.filter(x => x !== id)})
      }
      return Object.assign({}, state, { selectedNodeIds: state.selectedNodeIds.push(id)})
    case Constants.SET_SCROLL_TOP:
      return Object.assign({}, state, { scrollTop: action.payload })
    case Constants.SET_LOADING:
      return Object.assign({}, state, { loading: action.payload })
    case Constants.RESET_UI:
      return initialState
  }
  return initialState
}
