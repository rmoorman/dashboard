import * as Relay from 'react-relay'
import {AuthProviderType, AuthProviderDigits, AuthProviderAuth0} from '../types/types'

interface Props {
  authProviderId: string
  projectId: string
  type: AuthProviderType
  digits: AuthProviderDigits | null
  auth0: AuthProviderAuth0 | null
}

interface Response {
}

export default class UpdateAuthProviderMutation extends Relay.Mutation<Props, Response> {

  getMutation() {
    return Relay.QL`mutation{enableAuthProvider}`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on EnableAuthProviderPayload {
        authProvider
      }
    `
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        authProvider: this.props.authProviderId,
      },
    }]
  }

  getVariables() {
    return this.props
  }
}
