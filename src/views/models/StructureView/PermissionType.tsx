import * as React from 'react'
import { UserType, Field } from '../../../types/types'
import Icon from '../../../components/Icon/Icon'
import calculateSize from 'calculate-size'
const classes: any = require('./PermissionType.scss')

export interface DataCallbackProps {
  userType?: UserType
  userPath?: string[]
  userRole?: string
  useUserRole?: boolean
}

interface Props {
  params: any
  dataCallback: (data: DataCallbackProps) => void
  userType: UserType
  userPath: string[]
  userRole: string
  useUserRole: boolean
  availableUserRoles: string[]
  possibleRelatedPermissionPaths: Field[][]
  isValid: boolean
}

const emptyRoleToken = '____EMPTY_ROLE_TOKEN'
const addRoleToken = '____ADD_ROLE_TOKEN'
const emptyStepToken = '____EMPTY_STEP_TOKEN'

export default class PermissionType extends React.Component<Props, {}> {

  static contextTypes: React.ValidationMap<any> = {
    router: React.PropTypes.object.isRequired,
  }

  _onChangeUserType (userType: UserType) {
    this.props.dataCallback({
      userType,
      userPath: userType === 'RELATED' ? (this.props.userPath || []) : null,
    })
  }

  _onChangeUserRole (userRole: string) {
    if (userRole === addRoleToken) {
      (this.context as any).router.push(`/${this.props.params.projectName}/models/User/structure/edit/roles`)

      return
    }
    this.props.dataCallback({ userRole, useUserRole: true })
  }

  _isValid (userPath: string[]): boolean {
    return this.props.possibleRelatedPermissionPaths.findIndex((arr) => arr.map((f) => f.id).equals(userPath)) > -1
  }

  _updateUserPath (level: number, stepValue: string) {
    const newUserPath = this.props.userPath.slice(0, level)
    newUserPath.push(stepValue)
    this.props.dataCallback({ userPath: newUserPath })
  }

  _resetUserPath (level: number) {
    const newUserPath = this.props.userPath.slice(0, level)
    this.props.dataCallback({ userPath: newUserPath })
  }

  _disableUserRole () {
    this.props.dataCallback({ useUserRole: false, userRole: null })
  }

  _renderAuthenticated () {
    const fontOptions = {
      font: 'Open Sans',
      fontSize: '13px',
    }

    const selectedText = this.props.userRole || 'Select Role...'
    const selectWidth = calculateSize(selectedText, fontOptions).width

    return (
      <div className={`${classes.authenticated} ${this.props.useUserRole ? '' : classes.inactive}`}>
        <span>Limit to</span>
        <select
          style={{ width: selectWidth }}
          value={this.props.userRole || emptyRoleToken}
          onChange={(e: any) => this._onChangeUserRole(e.target.value)}
        >
          <option disabled value={emptyRoleToken}>Select Role...</option>
          {this.props.availableUserRoles.map((userRole) => (
            <option key={userRole} value={userRole}>{userRole}</option>
          ))}
          <optgroup label='Actions'>
            <option value={addRoleToken}>Create a new role...</option>
          </optgroup>
        </select>
        {this.props.useUserRole &&
          <div className={classes.delete} onClick={() => this._disableUserRole()}>
            <Icon
              width={15}
              height={15}
              src={require('assets/icons/close.svg')}
            />
          </div>
        }
      </div>
    )
  }

  _renderRelatedLevel (level: number) {
    const fields = this.props.possibleRelatedPermissionPaths
      .filter((arr) => arr.slice(0, level).map((f) => f.id).equals(this.props.userPath.slice(0, level)))
      .filter((arr) => arr.length - 1 >= level)
      .map((arr) => arr[level])
      .filter((field, index, arr) => arr.findIndex((f) => f.id === field.id) === index)

    const isOptional = this.props.isValid
      && this.props.userPath.length === level
    const addText = isOptional ? 'Add Step...' : 'Select Field...'
    const hasBeenSelected = this.props.userPath.length > level
    const selectedValue = hasBeenSelected
      ? this.props.userPath[level]
      : emptyStepToken
    const selectedText = hasBeenSelected
      ? fields.find((f) => f.id === this.props.userPath[level]).name
      : addText

    const fontWeight = hasBeenSelected ? 400 : 600
    const fontOptions = {
      font: 'Open Sans',
      fontSize: '12px',
      fontWeight,
    }

    const width = calculateSize(selectedText, fontOptions).width

    return (
      <div className={classes.relatedStep}>
        <select
          style={{ width, fontWeight }}
          value={selectedValue}
          className={isOptional ? classes.isOptional : ''}
          onChange={(e: any) => this._updateUserPath(level, e.target.value)}
        >
          <option disabled value={emptyStepToken}>{addText}</option>
          {fields.map((field) => (
            // TODO field.typeIdentifier doesn't work now that it would default to "Relation"
            <option key={field.id} value={field.id}>{field.name}: {field.typeIdentifier}</option>
          ))}
        </select>
        {selectedValue !== emptyStepToken &&
          <div className={classes.relatedDelete} onClick={() => this._resetUserPath(level)}>
            <Icon
              width={15}
              height={15}
              src={require('assets/icons/close.svg')}
            />
          </div>
        }
      </div>
    )
  }

  _renderRelated () {
    const maxDepth = this.props.possibleRelatedPermissionPaths.reduce((acc, arr) => Math.max(acc, arr.length), 0)
    const currentDepth = this.props.userPath.length
    const arrow = (
      <Icon
        width={11}
        height={6}
        src={require('assets/icons/arrow.svg')}
        color='#B9B9C8'
        rotate={-90}
      />
    )

    return (
      <div className={`${classes.related} ${this.props.isValid ? '' : classes.incomplete}`}>
        {this._renderRelatedLevel(0)}
        {currentDepth >= 1 && maxDepth >= 2 && arrow}
        {currentDepth >= 1 && maxDepth >= 2 && this._renderRelatedLevel(1)}
        {currentDepth >= 2 && maxDepth >= 3 && arrow}
        {currentDepth >= 2 && maxDepth >= 3 && this._renderRelatedLevel(2)}
        {!this.props.isValid &&
          <div className={classes.warning}>
            <Icon
              width={4}
              height={16}
              src={require('assets/icons/warning.svg')}
              />
          </div>
        }
      </div>
    )
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.container}>
          <select
            className={classes.userType}
            onChange={(e: any) => this._onChangeUserType(e.target.value as UserType)}
            value={this.props.userType}
          >
            <option value='GUEST'>Guest</option>
            <option value='AUTHENTICATED'>Authenticated</option>
            <option disabled value='RELATED'>Related</option>
            {
              // TODO enable again when related permission are implemented
              // <option disabled={this.props.possibleRelatedPermissionPaths.length === 0} value='RELATED'>
              // Related
              // </option>
            }
          </select>
          {this.props.userType === 'AUTHENTICATED' && this._renderAuthenticated()}
          {this.props.userType === 'RELATED' && this._renderRelated()}
        </div>
      </div>
    )
  }
}
