import {ReduxAction} from '../../types/reducers'
import Constants from '../../constants/databrowser/ui'
import SharedConstants from '../../constants/databrowser/shared'
import * as Immutable from 'immutable'
import {DataBrowserUIState} from '../../types/databrowser/ui'
import {ActionRowState} from '../../types/databrowser/actionrow'

const initialState: DataBrowserUIState = {
  filtersVisible: false,
  newRowVisible: false,
  selectedNodeIds: Immutable.List<string>(),
  scrollTop: 0,
  loading: true,
  actionRow: ActionRowState.NewNode,
}

export function reduceUI(state: DataBrowserUIState = initialState, action: ReduxAction): DataBrowserUIState {
  switch (action.type) {
    case Constants.HIDE_NEW_ROW:
      return Object.assign({}, state, {
        newRowVisible: false,
      })
    case Constants.TOGGLE_NEW_ROW:
      return Object.assign({}, state, {
        newRowVisible: !state.newRowVisible,
      })
    case Constants.TOGGLE_FILTER:
      return Object.assign({}, state, {
        filtersVisible: !state.filtersVisible,
      })
    case Constants.SET_NODE_SELECTION:
      return Object.assign({}, state, {
        selectedNodeIds: action.payload,
      })
    case Constants.CLEAR_NODE_SELECTION:
      return Object.assign({}, state, {
        selectedNodeIds: Immutable.List<string>(),
      })
    case Constants.TOGGLE_NODE_SELECTION:
      const id = action.payload
      if (state.selectedNodeIds.includes(id)) {
        return Object.assign({}, state, {
          selectedNodeIds: state.selectedNodeIds.filter(x => x !== id),
        })
      }
      return Object.assign({}, state, {
        selectedNodeIds: state.selectedNodeIds.concat(id),
      })
    case Constants.SET_SCROLL_TOP:
      return Object.assign({}, state, {
        scrollTop: action.payload,
      })
    case Constants.SET_LOADING:
      return Object.assign({}, state, {
        loading: action.payload,
      })
    case Constants.ACTIVATE_NEW_NODE_ROW:
      return Object.assign({}, state, {
        actionRow: ActionRowState.NewNode,
      })
    case Constants.ACTIVATE_SEARCH_ROW:
      return Object.assign({}, state, {
        actionRow: ActionRowState.Search,
      })
    case Constants.ACTIVATE_DELETE_NODE_ROW:
      return Object.assign({}, state, {
        actionRow: ActionRowState.DeleteNode,
      })
    case SharedConstants.RESET:
      return initialState
  }
  return state
}
