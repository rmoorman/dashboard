import * as Relay from 'react-relay'
import {AuthProviderType, AuthProviderDigits, AuthProviderAuth0} from '../types/types'

interface Props {
  projectId: string
  type: AuthProviderType
  digits: AuthProviderDigits | null
  auth0: AuthProviderAuth0 | null
}

interface Response {
}

export default class AddAuthProviderMutation extends Relay.Mutation<Props, Response> {

  getMutation() {
    return Relay.QL`mutation{enableAuthProvider}`
  }

  getFatQuery() {
    return Relay.QL`
      fragment on EnableAuthProviderPayload {
        authProviderEdge
        project
      }
    `
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'project',
      parentID: this.props.projectId,
      connectionName: 'authProviders',
      edgeName: 'authProviderEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables() {
    return this.props
  }
}
