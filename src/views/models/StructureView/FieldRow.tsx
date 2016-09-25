import * as React from 'react'
import * as Relay from 'react-relay'
import {Link} from 'react-router'
import Loading from '../../../components/Loading/Loading'
import UpdateFieldDescriptionMutation from '../../../mutations/UpdateFieldDescriptionMutation'
import DeleteFieldMutation from '../../../mutations/DeleteFieldMutation'
import {onFailureShowNotification} from '../../../utils/relay'
import {ShowNotificationCallback} from '../../../types/utils'
import {Field, Model} from '../../../types/types'
import Permissions from './Permissions'
import Constraints from './Constraints'
import Icon from '../../../components/Icon/Icon'
import {isScalar} from '../../../utils/graphql'
import {connect} from 'react-redux'
import {showNotification} from '../../../actions/notification'
import {bindActionCreators} from 'redux'
const classes: any = require('./FieldRow.scss')

type DetailsState = 'PERMISSIONS' | 'CONSTRAINTS'

interface Props {
  route: any
  field: Field
  allModels: Model[]
  params: any
  model: Model
  possibleRelatedPermissionPaths: Field[][]
  availableUserRoles: string[]
  showNotification: ShowNotificationCallback
}

interface State {
  editDescription: boolean
  editDescriptionPending: boolean
  detailsState: DetailsState
}

class FieldRow extends React.Component<Props, State> {

  state = {
    editDescription: false,
    editDescriptionPending: false,
    detailsState: null,
  }

  render () {
    const { field } = this.props

    let type: string = field.typeIdentifier
    if (field.isList) {
      type = `[${type}]`
    }
    if (field.isRequired) {
      type = `${type}!`
    }

    let suffix
    if (isScalar(field.typeIdentifier)) {
      suffix = `/models/${this.props.params.modelName}/structure/edit/${this.props.field.name}`
    } else {
      suffix = `/relations/edit/${this.props.field.relation.name}`
    }

    const editLink = `/${this.props.params.projectName}${suffix}` // tslint:disable-line

    return (
      <div className={classes.root}>
        <div className={`${classes.row} ${this.state.detailsState ? classes.active : ''}`}>
          <Link className={classes.fieldName} to={editLink}>
            <span className={classes.name}>{field.name}</span>
            {field.isSystem &&
              <span className={classes.system}>System</span>
            }
          </Link>
          <Link className={classes.type} to={editLink}>
            <span>{type}</span>
          </Link>
          <div className={classes.description}>
            {this.renderDescription()}
          </div>
          <div
            className={`${classes.constraints} ${this.state.detailsState === 'CONSTRAINTS' ? classes.active : '' }`}
            onClick={() => this.toggleConstraints()}
          >
            {field.isUnique &&
              <span className={classes.label}>Unique</span>
            }
            {!field.isUnique &&
              <span className={`${classes.label} ${classes.add}`}>
                Add Constraint
              </span>
            }
          </div>
          <div
            className={`${classes.permissions} ${this.state.detailsState === 'PERMISSIONS' ? classes.active : '' }`}
            onClick={() => this.togglePermissions()}
          >
            {field.permissions.edges.length === 0 &&
              <span className={`${classes.label} ${classes.add}`}>
                Add Permission
              </span>
            }
            {this.renderPermissionList()}
          </div>
          <div className={classes.controls}>
            {(!field.isSystem || (field.isSystem && field.name === 'roles')) &&
              <Link to={editLink}>
                <Icon
                  width={20}
                  height={20}
                  src={require('assets/icons/edit.svg')}
                />
              </Link>
            }
            {!field.isSystem && isScalar(field.typeIdentifier) &&
              <span onClick={() => this.deleteField()}>
                <Icon
                  width={20}
                  height={20}
                  src={require('assets/icons/delete.svg')}
                />
              </span>
            }
          </div>
        </div>
        {this.state.detailsState === 'PERMISSIONS' &&
          <Permissions
            route={this.props.route}
            field={field}
            params={this.props.params}
            possibleRelatedPermissionPaths={this.props.possibleRelatedPermissionPaths}
            availableUserRoles={this.props.availableUserRoles}
          />
        }
        {this.state.detailsState === 'CONSTRAINTS' &&
          <Constraints
            field={field}
          />
        }
      </div>
    )
  }

  private deleteField () {
    if (window.confirm(`Do you really want to delete "${this.props.field.name}"?`)) {
      Relay.Store.commitUpdate(
        new DeleteFieldMutation({
          fieldId: this.props.field.id,
          modelId: this.props.model.id,
        }),
        {
          onSuccess: () => {
            analytics.track('models/structure: deleted field', {
              project: this.props.params.projectName,
              model: this.props.params.modelName,
              field: this.props.field.name,
            })
          },
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.props.showNotification)
          },
        }
      )
    }
  }

  private saveDescription (e) {
    const description = e.target.value
    if (this.props.field.description === description) {
      this.setState({ editDescription: false } as State)
      return
    }

    this.setState({ editDescriptionPending: true } as State)

    Relay.Store.commitUpdate(
      new UpdateFieldDescriptionMutation({
        fieldId: this.props.field.id,
        description,
      }),
      {
        onSuccess: () => {
          analytics.track('models/structure: edited description')

          this.setState({
            editDescription: false,
            editDescriptionPending: false,
          } as State)
        },
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.props.showNotification)
          this.setState({
            editDescription: false,
            editDescriptionPending: false,
          } as State)
        },
      }
    )
  }

  private togglePermissions () {
    const detailsState = this.state.detailsState === 'PERMISSIONS' ? null : 'PERMISSIONS' as DetailsState
    this.setState({ detailsState } as State)
  }

  private toggleConstraints () {
    const detailsState = this.state.detailsState === 'CONSTRAINTS' ? null : 'CONSTRAINTS' as DetailsState
    this.setState({ detailsState } as State)
  }

  private renderDescription () {
    if (this.props.field.relation) {
      return
    }
    if (this.state.editDescriptionPending) {
      return (
        <Loading color='#B9B9C8' />
      )
    }

    if (this.state.editDescription) {
      return (
        <input
          autoFocus
          type='text'
          placeholder='Description'
          defaultValue={this.props.field.description}
          onBlur={(e) => this.saveDescription(e)}
          onKeyDown={(e) => e.keyCode === 13 ? (e.target as HTMLInputElement).blur() : null}
        />
      )
    }

    if (!this.props.field.description) {
      return (
        <span
          className={classes.addDescription}
          onClick={() => this.setState({ editDescription: true } as State)}
        >
          Add description
        </span>
      )
    }

    return (
      <span
        className={classes.descriptionText}
        onClick={() => this.setState({ editDescription: true } as State)}
      >
        {this.props.field.description}
      </span>
    )
  }

  private renderPermissionList = () => {
    const permissionCount = this.props.field.permissions.edges.map((edge) => edge.node).reduce(
      (prev, node) => {
        if (!prev[node.userType]) {
          prev[node.userType] = 1
        } else {
          prev[node.userType]++
        }
        return prev
      },
      {})
    const permissions = []
    for (let key in permissionCount) {
      if (permissionCount.hasOwnProperty(key)) {
        permissions.push(
          <span
            key={key}
            className={classes.label}
          >
            {permissionCount[key] > 1 ? `${permissionCount[key]}x ${key}` : `${key}`}
          </span>
        )
      }
    }
    return permissions
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({showNotification}, dispatch)
}

const MappedFieldRow = connect(null, mapDispatchToProps)(FieldRow)

export default Relay.createContainer(MappedFieldRow, {
  fragments: {
    field: () => Relay.QL`
      fragment on Field {
        id
        name
        typeIdentifier
        isSystem
        isRequired
        isUnique
        isList
        description
        permissions(first: 100) {
          edges {
            node {
              id
              userType
            }
          }
        }
        relation {
            name
        }
        ${Permissions.getFragment('field')}
      }
    `,
  },
})
