import * as Relay from 'react-relay'
import { Viewer } from '../types/types'

interface Props {
  viewer: Viewer
  email: string
  password: string
}

interface Response {
  token: string
  viewer: Viewer
}

export default class LoginMutation extends Relay.Mutation<Props, Response> {

  getMutation () {
    return Relay.QL`mutation{signinCustomer}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on SigninCustomerPayload {
        viewer {
          user
        }
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    }, {
      type: 'REQUIRED_CHILDREN',
      children: [Relay.QL`
        fragment on SigninCustomerPayload {
          token
          viewer {
            user {
              id
            }
          }
        }
      `],
    }]
  }

  getVariables () {
    return {
      email: this.props.email,
      password: this.props.password,
    }
  }
}
