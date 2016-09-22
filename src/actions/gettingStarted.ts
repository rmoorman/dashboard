import * as Relay from 'react-relay'
import { ReduxAction } from '../types/reducers'
import { GettingStartedState } from './../types/gettingStarted'
import UpdateCustomerMutation from '../mutations/UpdateCustomerMutation'
import Constants from '../constants/gettingStarted'

export function update (step: string, userId: string): ReduxAction {
  const payload = {gettingStartedState: new GettingStartedState({step, userId})}
  return {type: Constants.UPDATE, payload}
}

function updateReduxAndRelay (dispatch: (action: ReduxAction) => any, step: string, userId: string): Promise<{}> {
  return new Promise((resolve, reject) => {
    console.log(userId)
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
    const currentStep = getState().gettingStarted.gettingStartedState.step
    const currentStepIndex = GettingStartedState.steps.indexOf(currentStep)
    const nextStep = GettingStartedState.steps[currentStepIndex + 1]
    const userId = getState().gettingStarted.gettingStartedState.userId

    return updateReduxAndRelay(dispatch, nextStep, userId)
  }
}

export function skip (): (dispatch: (action: ReduxAction) => any, getState: any) => Promise<{}> {
  return function (dispatch: (action: ReduxAction) => any, getState): Promise<{}> {
    const nextStep = 'STEP11_SKIPPED'
    const userId = getState().gettingStarted.gettingStartedState.userId

    return updateReduxAndRelay(dispatch, nextStep, userId)
  }
}

export function fetchGettingStartedState (): (dispatch: (action: ReduxAction) => any) => Promise<{}> {
  return function (dispatch: (action: ReduxAction) => any): Promise<{}> {
    const query = Relay.createQuery(
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
