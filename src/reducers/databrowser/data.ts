import {ReduxAction} from '../../types/reducers'
import Constants from '../../constants/databrowser/data'
import SharedConstants from '../../constants/databrowser/shared'
import * as Immutable from 'immutable'
import {OrderBy} from '../../types/types'

interface State {
  nodes: Immutable.List<Immutable.Map<string, any>>
  orderBy: OrderBy
  filter: Immutable.Map<string, any>
  itemCount: number
  loaded: Immutable.List<boolean>
}

const initialState: State =  {
  nodes: Immutable.List<Immutable.Map<string, any>>(),
  orderBy: {
    fieldName: 'id',
    order: 'DESC',
  },
  filter: Immutable.Map<string, any>(),
  itemCount: 0,
  loaded: Immutable.List<boolean>(),
}

export function reduceData(state: State = initialState, action: ReduxAction): State {
  switch (action.type) {
    case Constants.SET_ORDER:
      return Object.assign({}, state, { orderBy: action.payload })
    case Constants.SET_FILTER:
      const {fieldName, value} = action.payload
      return Object.assign({}, state, { filter: state.filter.set(fieldName, value) })
    case Constants.SET_ITEMCOUNT:
      return Object.assign({}, state, { itemCount: action.payload })
    case SharedConstants.RESET:
      return initialState
  }
  return state
}
