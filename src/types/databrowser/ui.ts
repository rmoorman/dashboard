import * as Immutable from 'immutable'
import {ActionRowState} from "./actionrow"

export interface DataBrowserUIState {
  filtersVisible: boolean
  newRowActive: boolean
  selectedNodeIds: Immutable.List<string>
  scrollTop: number
  loading: boolean
  actionRow: ActionRowState
  selectedCell: [number, String]
  editing: boolean
  browserViewRef: any
}
