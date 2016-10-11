import * as Immutable from 'immutable'
import {ActionRowState} from './actionrow'

export interface DataBrowserUIState {
  filtersVisible: boolean
  newRowActive: boolean
  selectedNodeIds: Immutable.List<string>
  scrollTop: number
  loading: boolean
  actionRow: ActionRowState
  selectedCell: GridPosition
  editing: boolean
  browserViewRef: HTMLElement
  writing: boolean
}

export interface GridPosition {
  row: number
  field: string
}
