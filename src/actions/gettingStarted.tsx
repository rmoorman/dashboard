import * as React from 'react' // tslint:disable-line
import * as Relay from 'react-relay'
import {ReduxAction} from '../types/reducers'
import {GettingStartedState, Step} from './../types/gettingStarted'
import UpdateCustomerMutation from '../mutations/UpdateCustomerMutation'
import Constants from '../constants/gettingStarted'
import IconNotification from '../components/IconNotification/IconNotification'
import cuid from 'cuid'
import {showPopup} from '../actions/popup'

export function showNotification() {
  const id = cuid()
  const element = <IconNotification id={id}/>
  return showPopup({id, element, blurBackground: false})
}

export function update(step: Step, userId: string): ReduxAction {
  const payload = {gettingStartedState: new GettingStartedState({step, userId})}
  return {type: Constants.UPDATE, payload}
}

function updateReduxAndRelay(dispatch: (action: ReduxAction) => any, step: Step, userId: string): Promise<{}> {
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

export function nextStep(): (dispatch: (action: ReduxAction) => any, getState: any) => Promise<{}> {
  return function (dispatch: (action: ReduxAction) => any, getState): Promise<{}> {
    const {step, userId} = getState().gettingStarted.gettingStartedState
    const currentStepIndex = GettingStartedState.steps.indexOf(step)
    const nextStep = GettingStartedState.steps[currentStepIndex + 1]

    return updateReduxAndRelay(dispatch, nextStep, userId)
  }
}

export function skip(): (dispatch: (action: ReduxAction) => any, getState: any) => Promise<{}> {
  return function (dispatch: (action: ReduxAction) => any, getState): Promise<{}> {
    const nextStep: Step = 'STEP11_SKIPPED'
    const {userId} = getState().gettingStarted.gettingStartedState

    return updateReduxAndRelay(dispatch, nextStep, userId)
  }
}

export function fetchGettingStartedState(): (dispatch: (action: ReduxAction) => any) => Promise<{}> {
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
      // dispatch(update('STEP1_OVERVIEW', 'my-mock'))
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
