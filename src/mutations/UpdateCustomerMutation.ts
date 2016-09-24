import * as Relay from 'react-relay'

interface Props {
  customerId: string
  gettingStartedStatus?: string
  name?: string
  email?: string
}

export default class UpdateCustomerMutation extends Relay.Mutation<Props, {}> {

  getMutation () {
    return Relay.QL`mutation{updateCustomer}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdateCustomerPayload {
        user
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.customerId,
      },
    }]
  }

  getVariables () {
    return {
      gettingStartedStatus: this.props.gettingStartedStatus,
      name: this.props.name,
      email: this.props.email,
    }
  }

  getOptimisticResponse () {
    return {
      user: {
        id: this.props.customerId,
        gettingStartedStatus: this.props.gettingStartedStatus,
        name: this.props.name,
        email: this.props.email,
      },
    }
  }
}
