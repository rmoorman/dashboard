import * as React from 'react'
import * as Relay from 'react-relay'
import { Field } from '../../../types/types'
import PermissionRow from './PermissionRow'
const classes: any = require('./Permissions.scss')

interface Props {
  params: any
  field: Field
  possibleRelatedPermissionPaths: Field[][]
  route: any
}

interface State {
  showNewPermission: boolean
}

class Permissions extends React.Component<Props, State> {

  state = {
    showNewPermission: false,
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div className={classes.permissionType}>Permissions</div>
          <div className={classes.allow}>
            <div>Read</div>
            <div>Create</div>
            <div>Update</div>
            <div>Delete</div>
          </div>
          <div className={classes.description}>Description</div>
          <div className={classes.controls}></div>
        </div>
        {(this.props.field.permissions.edges.length > 0 || this.state.showNewPermission) &&
          <div className={classes.permissions}>
            {this.props.field.permissions.edges.map((permissionEdge) => (
              <PermissionRow
                route={this.props.route}
                key={permissionEdge.node.id}
                fieldId={this.props.field.id}
                params={this.props.params}
                permission={permissionEdge.node}
                possibleRelatedPermissionPaths={this.props.possibleRelatedPermissionPaths}
              />
            ))}
            {this.state.showNewPermission &&
            <PermissionRow
              route={this.props.route}
              fieldId={this.props.field.id}
              params={this.props.params}
              permission={null}
              hide={() => this.setState({ showNewPermission: false })}
              possibleRelatedPermissionPaths={this.props.possibleRelatedPermissionPaths}
            />
            }
          </div>
        }
        {!this.state.showNewPermission &&
          <div
            className={classes.add}
            onClick={() => this.setState({ showNewPermission: true })}
          >
            + Create permission
          </div>
        }
      </div>
    )
  }
}

export default Relay.createContainer(Permissions, {
  fragments: {
    field: () => Relay.QL`
      fragment on Field {
        id
        permissions(first: 100) {
          edges {
            node {
              id
              ${PermissionRow.getFragment('permission')}
            }
          }
        }
      }
    `,
  },
})
