import * as React from 'react'
import * as Relay from 'react-relay'
import {withRouter} from 'react-router'
import {Permission, UserType, Field} from '../../../types/types'
import {DataCallbackProps} from './PermissionType'
import PermissionType from './PermissionType'
import Loading from '../../../components/Loading/Loading'
import AddPermissionMutation from '../../../mutations/AddPermissionMutation'
import UpdatePermissionMutation from '../../../mutations/UpdatePermissionMutation'
import DeletePermissionMutation from '../../../mutations/DeletePermissionMutation'
import {onFailureShowNotification} from '../../../utils/relay'
import {ShowNotificationCallback} from '../../../types/utils'
import {connect} from 'react-redux'
import {showNotification} from '../../../actions/notification'
import {bindActionCreators} from 'redux'
import Icon from '../../../components/Icon/Icon'
const classes: any = require('./PermissionRow.scss')

interface Props {
  params: any
  router: ReactRouter.InjectedRouter
  route: any
  fieldId: string
  permission?: Permission
  hide?: () => void
  possibleRelatedPermissionPaths: Field[][]
  availableUserRoles: string[]
  showNotification: ShowNotificationCallback
}

interface State {
  saving: boolean
  editing: boolean
  isValid: boolean
  editDescription: boolean
  userType: UserType
  userPath: string[]
  userRole: string
  useUserRole: boolean
  allowRead: boolean
  allowCreate: boolean
  allowUpdate: boolean
  allowDelete: boolean
  description: string
}

class PermissionRow extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)

    const permission = props.permission || {
        userType: 'GUEST' as UserType,
        userPath: null,
        userRole: null,
        allowRead: false,
        allowCreate: false,
        allowUpdate: false,
        allowDelete: false,
        description: null,
      }

    const userPath = permission.userType === 'RELATED' ? (permission.userPath || []) : null

    this.state = {
      saving: false,
      editing: !props.permission,
      isValid: this.isValid(permission.userType, userPath),
      editDescription: false,
      userType: permission.userType,
      userPath,
      userRole: permission.userRole,
      useUserRole: !!permission.userRole,
      allowRead: permission.allowRead,
      allowCreate: permission.allowCreate,
      allowUpdate: permission.allowUpdate,
      allowDelete: permission.allowDelete,
      description: permission.description,
    }
  }

  componentDidMount = () => {
    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if (this.state.editing) {
        // TODO with custom dialogs use "return false" and display custom dialog
        return 'Are you sure you want to discard unsaved changes?'
      }
    })
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.permissionType}>
          <PermissionType
            userType={this.state.userType}
            userPath={this.state.userPath}
            userRole={this.state.userRole}
            isValid={this.state.isValid}
            useUserRole={this.state.useUserRole}
            dataCallback={(data) => this.onPermissionTypeDataCallback(data)}
            possibleRelatedPermissionPaths={this.props.possibleRelatedPermissionPaths}
            availableUserRoles={this.props.availableUserRoles}
            params={this.props.params}
          />
        </div>
        <div className={classes.allow}>
          <div>
            <input
              onChange={() => this.toggleAllowRead()}
              checked={this.state.allowRead}
              type='checkbox'
            />
          </div>
          <div>
            <input
              onChange={() => this.toggleAllowCreate()}
              checked={this.state.allowCreate}
              type='checkbox'
            />
          </div>
          <div>
            <input
              onChange={() => this.toggleAllowUpdate()}
              checked={this.state.allowUpdate}
              type='checkbox'
            />
          </div>
          <div>
            <input
              onChange={() => this.toggleAllowDelete()}
              checked={this.state.allowDelete}
              type='checkbox'
            />
          </div>
        </div>
        <div className={classes.description}>{this.renderDescription()}</div>
        <div className={classes.controls}>{this.renderControls()}</div>
      </div>
    )
  }

  private toggleAllowRead () {
    this.beginEditing()
    this.setState({ allowRead: !this.state.allowRead } as State)
  }

  private toggleAllowCreate () {
    this.beginEditing()
    this.setState({ allowCreate: !this.state.allowCreate } as State)
  }

  private toggleAllowUpdate () {
    this.beginEditing()
    this.setState({ allowUpdate: !this.state.allowUpdate } as State)
  }

  private toggleAllowDelete () {
    this.beginEditing()
    this.setState({ allowDelete: !this.state.allowDelete } as State)
  }

  private updateDescription (description: string) {
    this.beginEditing()
    this.setState({
      editDescription: true,
      description: description,
    } as State)
  }

  private beginEditing () {
    this.setState({ editing: true } as State)
  }

  private onPermissionTypeDataCallback (data: DataCallbackProps) {
    let partialState = Object.assign({ editing: true }, data) as State

    if (data.hasOwnProperty('userPath')) {
      partialState.isValid = this.isValid(data.userType, data.userPath)
    }

    this.setState(partialState)
  }

  private isValid (userType: UserType, userPath: string[]): boolean {
    return userType !== 'RELATED' ||
      this.props.possibleRelatedPermissionPaths.findIndex((arr) => arr.map((f) => f.id).equals(userPath)) > -1
  }

  private save () {
    this.setState({ saving: true } as State)

    if (this.props.permission) {
      this.update()
    } else {
      this.create()
    }
  }

  private create () {
    Relay.Store.commitUpdate(
      new AddPermissionMutation({
        fieldId: this.props.fieldId,
        userType: this.state.userType,
        userPath: this.state.userPath,
        userRole: this.state.useUserRole ? this.state.userRole : null,
        description: this.state.description,
        allowRead: this.state.allowRead,
        allowCreate: this.state.allowCreate,
        allowUpdate: this.state.allowUpdate,
        allowDelete: this.state.allowDelete,
      }),
      {
        onSuccess: () => {
          this.setState({
            editing: false,
            saving: false,
          } as State)

          this.props.hide()
        },
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.props.showNotification)

          this.setState({
            editing: false,
            saving: false,
          } as State)
        },
      }
    )
  }

  private update () {
    Relay.Store.commitUpdate(
      new UpdatePermissionMutation({
        permissionId: this.props.permission.id,
        userType: this.state.userType,
        userPath: this.state.userPath,
        userRole: this.state.useUserRole ? this.state.userRole : null,
        description: this.state.description,
        allowRead: this.state.allowRead,
        allowCreate: this.state.allowCreate,
        allowUpdate: this.state.allowUpdate,
        allowDelete: this.state.allowDelete,
      }),
      {
        onSuccess: () => {
          this.setState({
            editing: false,
            saving: false,
          } as State)
        },
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.props.showNotification)

          this.setState({
            editing: false,
            saving: false,
          } as State)
        },
      }
    )
  }

  private cancel = () => {
    if (this.props.hide) {
      this.props.hide()
    }

    if (this.props.permission) {
      const userPath = this.props.permission.userType === 'RELATED' ? (this.props.permission.userPath || []) : null

      this.setState({
        editing: false,
        saving: false,
        isValid: this.isValid(this.props.permission.userType, userPath),
        editDescription: false,
        userType: this.props.permission.userType,
        userPath,
        userRole: this.props.permission.userRole,
        useUserRole: !!this.props.permission.userRole,
        allowRead: this.props.permission.allowRead,
        allowCreate: this.props.permission.allowCreate,
        allowUpdate: this.props.permission.allowUpdate,
        allowDelete: this.props.permission.allowDelete,
        description: this.props.permission.description,
      })
    }
  }

  private delete = () => {
    if (window.confirm('Do you really want to delete this permission')) {
      Relay.Store.commitUpdate(
        new DeletePermissionMutation({
          fieldId: this.props.fieldId,
          permissionId: this.props.permission.id,
        }),
        {
          onSuccess: () => {
            analytics.track('models/fields: deleted permission')
          },
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.props.showNotification)
          },
        }
      )
    }
  }

  private onKeyDown (e: any) {
    if (e.keyCode === 13) {
      e.target.blur()
      this.save()
    }
  }

  private renderDescription = () => {
    if (this.state.description || this.state.editDescription) {
      return (
        <input
          autoFocus={this.state.editDescription}
          type='text'
          placeholder='Description'
          value={this.state.description}
          onChange={(e: any) => this.updateDescription((e.target as HTMLInputElement).value)}
          onKeyDown={(e: any) => this.onKeyDown(e)}
          />
        )
      }

    return (
      <span
        className={classes.addDescription}
        onClick={() => this.setState({ editDescription: true } as State)}
      >
        Add description
      </span>
    )
  }

  private renderControls = () => {
    if (this.state.saving) {
      return (
        <div className={classes.controls}>
          <Loading color='#B9B9C8' />
        </div>
      )
    }

    if (this.state.editing) {
      return (
        <div className={classes.controls}>
          {this.state.isValid &&
            <span onClick={() => this.save()}>Save</span>
          }
          <span onClick={() => this.cancel()}>Cancel</span>
        </div>
      )
    }

    return (
      <div className={classes.controls}>
        <span className={classes.delete} onClick={() => this.delete()}>
          <Icon
            width={20}
            height={20}
            src={require('assets/icons/delete.svg')}
          />
        </span>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({showNotification}, dispatch)
}

const MappedPermissionRow = connect(null, mapDispatchToProps)(withRouter(PermissionRow))

export default Relay.createContainer(MappedPermissionRow, {
  fragments: {
    permission: () => Relay.QL`
      fragment on Permission {
        id
        userType
        userPath
        userRole
        description
        allowRead
        allowCreate
        allowUpdate
        allowDelete
      }
    `,
  },
})
