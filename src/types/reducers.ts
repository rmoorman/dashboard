export interface ReduxAction {
  type: string,
  payload?: any,
}

export type Dispatch = (action: ReduxAction) => any

export type ReduxThunk = (dispatch: Dispatch, getState: () => any) => Promise<{}>
