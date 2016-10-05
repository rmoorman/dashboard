import * as Immutable from 'immutable'
import {ActionRowState} from "./actionrow"

export interface DataBrowserUIState {
  filtersVisible: boolean
  newRowVisible: boolean
  selectedNodeIds: Immutable.List<string>
  scrollTop: number
  loading: boolean
  actionRow: ActionRowState
}
