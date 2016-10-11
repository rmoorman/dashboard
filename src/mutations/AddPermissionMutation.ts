import * as Relay from 'react-relay'
import {UserType} from '../types/types'

interface Props {
  fieldId: string
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

export default class AddPermissionMutation extends Relay.Mutation<Props, Response> {

  getMutation () {
    return Relay.QL`mutation{addPermission}`
  }

  getFatQuery () {
    return Relay.QL`
      fragment on AddPermissionPayload {
        permissionEdge
        field
      }
    `
  }

  getConfigs () {
    return [{
      type: 'RANGE_ADD',
      parentName: 'field',
      parentID: this.props.fieldId,
      connectionName: 'permissions',
      edgeName: 'permissionEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }]
  }

  getVariables () {
    return {
      fieldId: this.props.fieldId,
      userType: this.props.userType,
      userPath: this.props.userPath,
      description: this.props.description,
      allowRead: this.props.allowRead,
      allowCreate: this.props.allowCreate,
      allowUpdate: this.props.allowUpdate,
      allowDelete: this.props.allowDelete,
    }
  }
}
