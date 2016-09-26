import * as Relay from 'react-relay'
import {Step} from '../types/gettingStarted'
import {Example} from '../types/types'

interface Props {
  onboardingStatusId: string
  gettingStarted: Step
  gettingStartedSkipped: boolean
  gettingStartedExample: Example
}

export default class UpdateCustomerOnboardingStatusMutation extends Relay.Mutation<Props, {}> {

  getMutation () {
    return Relay.QL`mutation{updateCrmOnboardingStatus}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateCrmOnboardingStatusPayload {
        onboardingStatus
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        onboardingStatus: this.props.onboardingStatusId,
      },
    }]
  }

  getVariables () {
    return {
      gettingStarted: this.props.gettingStarted,
      gettingStartedSkipped: this.props.gettingStartedSkipped,
      gettingStartedExample: this.props.gettingStartedExample,
    }
  }

  getOptimisticResponse () {
    return {
      user: {
        id: this.props.onboardingStatusId,
        gettingStarted: this.props.gettingStarted,
        gettingStartedSkipped: this.props.gettingStartedSkipped,
      },
    }
  }
}
