import * as Immutable from 'immutable'

export interface DataBrowserUIState {
  filtersVisible: boolean
  newRowVisible: boolean
  selectedNodeIds: Immutable.List<string>
  scrollTop: number
  loading: boolean
}
