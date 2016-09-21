import UpdateCustomerMutation from '../mutations/UpdateCustomerMutation'
import * as Relay from 'react-relay'
import { ReduxAction } from '../types/reducers'

interface Props {
  step: string,
  userId: string
}

export class GettingStartedState {

  static steps: [string] = [
    'STEP1_OVERVIEW',
    'STEP2_CREATE_TODO_MODEL',
    'STEP3_CREATE_TEXT_FIELD',
    'STEP4_CREATE_COMPLETED_FIELD',
    'STEP5_GOTO_DATA_TAB',
    'STEP6_ADD_DATA_ITEM_1',
    'STEP7_ADD_DATA_ITEM_2',
    'STEP8_GOTO_GETTING_STARTED',
    'STEP9_WAITING_FOR_REQUESTS',
    'STEP10_DONE',
    'STEP11_SKIPPED',
  ]

  step: string

  progress: number

  private userId: string

  constructor (props: Props) {
    this.userId = props.userId
    this.update(props.step)
  }

  isActive = (): boolean => {
    return this.step !== 'STEP10_DONE' && this.step !== 'STEP11_SKIPPED'
  }

  isCurrentStep = (step: string): boolean => {
    return step === this.step
  }

  update = (step: string): void => {
    const currentStepIndex = GettingStartedState.steps.indexOf(this.step)
    const stepIndex = GettingStartedState.steps.indexOf(step)
    if (currentStepIndex > stepIndex) {
      return
    }

    this.step = step

    switch (step) {
      case 'STEP1_OVERVIEW': this.progress = 0
        break
      case 'STEP2_CREATE_TODO_MODEL': this.progress = 1
        break
      case 'STEP3_CREATE_TEXT_FIELD': this.progress = 1
        break
      case 'STEP4_CREATE_COMPLETED_FIELD': this.progress = 1
        break
      case 'STEP5_GOTO_DATA_TAB': this.progress = 2
        break
      case 'STEP6_ADD_DATA_ITEM_1': this.progress = 2
        break
      case 'STEP7_ADD_DATA_ITEM_2': this.progress = 2
        break
      case 'STEP8_GOTO_GETTING_STARTED': this.progress = 3
        break
      case 'STEP9_WAITING_FOR_REQUESTS': this.progress = 3
        break
      case 'STEP10_DONE': this.progress = 4
        break
      case 'STEP11_SKIPPED': this.progress = 0
        break
    }
  }
}

// Actions
const UPDATE = 'dashboard/gettingStartedReducer/UPDATE'

// Reducer
interface State {
  checkStatus: boolean,
  gettingStartedState?: any
}

const initialState: State = {checkStatus: false}

export function reduceGettingStartedState (state: State = initialState, action: ReduxAction): State {
  switch (action.type) {
    case UPDATE:
      let gettingStartedState = action.payload.gettingStartedState

      // TODO: use reselect for derived data
      return Object.assign({}, state, {
        gettingStartedState,
        checkStatus: gettingStartedState.isCurrentStep('STEP9_WAITING_FOR_REQUESTS'),
      })
    default:
      return state
  }
}

// Action Creators
export function update (step: string, userId: string): ReduxAction {
  const payload = {gettingStartedState: new GettingStartedState({step, userId})}
  return {type: UPDATE, payload}
}

function updateReduxAndRelay (dispatch: (action: ReduxAction) => any, step: string, userId: string): Promise<{}> {
  return new Promise((resolve, reject) => {
    Relay.Store.commitUpdate(
      new UpdateCustomerMutation(
        {
          userId: userId,
          gettingStartedStatus: step,
        }),
      {
        onSuccess: () => {
          dispatch(update(step, userId))
          resolve()
        },
        onFailure: reject,
    })
  })
}

export function nextStep (): (dispatch: (action: ReduxAction) => any, getState: any) => Promise<{}> {
  return function (dispatch: (action: ReduxAction) => any, getState): Promise<{}> {
    const currentStep = getState().gettingStartedState.step
    const currentStepIndex = GettingStartedState.steps.indexOf(currentStep)
    const nextStep = GettingStartedState.steps[currentStepIndex + 1]
    const userId = getState().gettingStartedState.userId

    return updateReduxAndRelay(dispatch, nextStep, userId)
  }
}

export function skip (): (dispatch: (action: ReduxAction) => any, getState: any) => Promise<{}> {
  return function (dispatch: (action: ReduxAction) => any, getState): Promise<{}> {
    const nextStep = 'STEP11_SKIPPED'
    const userId = getState().gettingStartedState.userId

    return updateReduxAndRelay(dispatch, nextStep, userId)
  }
}

export function fetchGettingStartedState (): (dispatch: (action: ReduxAction) => any) => Promise<{}> {
  return function (dispatch: (action: ReduxAction) => any): Promise<{}> {
    let query = Relay.createQuery(
      Relay.QL`
      query {
        viewer {
          user {
            id
            gettingStartedStatus
          }
        }
      }`,
      {})

    return new Promise(function (resolve: () => any, reject: (error: Error) => any) {
      Relay.Store.primeCache({query}, ({done, error}) => {
        if (done) {
          const data = Relay.Store.readQuery(query)[0]
          dispatch(update(data.user.gettingStartedStatus, data.user.id))
          resolve()
        } else if (error) {
          reject(Error('Error when fetching gettingStartedState'))
        }
      })
    })
  }
}
