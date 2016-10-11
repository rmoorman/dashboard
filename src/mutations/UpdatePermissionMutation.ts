import * as Relay from 'react-relay'
import {UserType} from '../types/types'

interface Props {
  permissionId: string
  userType: UserType
  userPath: string[]
  description: string
  allowRead: boolean
  allowCreate: boolean
  allowUpdate: boolean
  allowDelete: boolean
}

interface Response {
}

export default class UpdatePermissionMutation extends Relay.Mutation<Props, Response> {

  getMutation () {
    return Relay.QL`mutation{updatePermission}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on UpdatePermissionPayload {
        permission
      }
    `
  }

  getConfigs () {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        permission: this.props.permissionId,
      },
    }]
  }

  getVariables () {
    return this.props
  }
}
