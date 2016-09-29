import * as React from 'react'
import * as Relay from 'react-relay'
import Icon from '../../../components/Icon/Icon'
import {Link} from 'react-router'
import {getFieldTypeName} from '../../../utils/valueparser'
import {isScalar} from '../../../utils/graphql'
import {Field} from '../../../types/types'
import {debounce} from '../../../utils/utils'
const classes: any = require('./HeaderCell.scss')

interface Props {
  field: Field
  sortOrder?: string
  toggleSortOrder: () => void
  updateFilter: (value: string) => void
  filterVisible: boolean
  params: any
}

class HeaderCell extends React.Component<Props, {}> {

  delayedUpdateFilter: any

  constructor(props) {
    super(props)

    this.delayedUpdateFilter = debounce(this.props.updateFilter, 150)
  }

  render() {
    const {field, sortOrder, params} = this.props

    let type = getFieldTypeName(field)
    if (field.isList) {
      type = `[${type}]`
    }
    if (field.isRequired) {
      type = `${type}!`
    }

    const editUrl = `/${params.projectName}/models/${params.modelName}/structure/edit/${field.name}`

    return (
      <div
        style={{ width: '100%' }}
        className={classes.root}
      >
        <div className={classes.row}>
          <div className={classes.fieldName}>
            {field.name}
            <span className={classes.type}>{type}</span>
            {isScalar(field.typeIdentifier) && !field.isSystem &&
            <Link to={editUrl} className={classes.edit}>
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/edit.svg')}
              />
            </Link>
            }
          </div>
          {isScalar(field.typeIdentifier) && !field.isList &&
          <div
            onClick={this.toggleSortOrder}
            className={`${classes.sort} ${sortOrder ? classes.active : ''}`}
          >
            <Icon
              src={require('assets/icons/arrow.svg')}
              width={11}
              height={6}
              rotate={sortOrder === 'DESC' ? 180 : 0}
            />
          </div>
          }
        </div>
        {this.props.filterVisible &&
        <div className={classes.row}>
          {this.renderFilter()}
        </div>
        }
      </div>
    )
  }

  private onFilterChangeString(value: string) {
    this.delayedUpdateFilter(value !== '' ? `"${value}"` : null)
  }

  private onFilterChangeEnum(value: string) {
    this.delayedUpdateFilter(value !== '' ? `${value}` : null)
  }

  private onFilterChangeNumber(value: string) {
    this.delayedUpdateFilter(value !== '' ? value : null)
  }

  private onFilterChangeBoolean(value: any) {
    this.props.updateFilter(value !== '' ? value.toString() : null)
  }

  private toggleSortOrder = () => {
    if (isScalar(this.props.field.typeIdentifier)) {
      this.props.toggleSortOrder()
    }
  }

  private renderFilter() {
    switch (this.props.field.typeIdentifier) {
      case 'Relation':
        return (
          <div className={classes.noFilter}>
            Filters are not available for Relations
          </div>
        )
      case 'Int':
        return (
          <input
            type='number'
            placeholder={`Filter by ${this.props.field.name}`}
            onChange={(e: any) => this.onFilterChangeNumber(e.target.value)}
          />
        )
      case 'Float':
        return (
          <input
            type='number'
            step='any'
            placeholder={`Filter by ${this.props.field.name}`}
            onChange={(e: any) => this.onFilterChangeNumber(e.target.value)}
          />
        )
      case 'Boolean':
        return (
          <select
            onChange={(e: any) => this.onFilterChangeBoolean(e.target.value)}>
            <option value={''}>{`Filter by ${this.props.field.name}`}</option>
            <option value={'true'}>true</option>
            <option value={'false'}>false</option>
          </select>
        )
      case 'Enum':
        return (
          <select
            onChange={(e: any) => this.onFilterChangeEnum(e.target.value)}
          >
            <option value={''}>{`Filter by ${this.props.field.name}`}</option>
            {this.props.field.enumValues.map((enumValue) => (
              <option key={enumValue}>{enumValue}</option>
            ))}
          </select>
        )
      default:
        return (
          <input
            type='text'
            placeholder={`Filter by ${this.props.field.name}`}
            onChange={(e: any) => this.onFilterChangeString(e.target.value)}
          />
        )
    }
  }

}

export default Relay.createContainer(HeaderCell, {
    fragments: {
        field: () => Relay.QL`
            fragment on Field {
                id
                name
                isList
                typeIdentifier
                isSystem
                isRequired
                enumValues
                relatedModel {
                  name
                }
            }
        `,
    },
})
