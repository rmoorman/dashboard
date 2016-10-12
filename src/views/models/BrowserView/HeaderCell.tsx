import * as React from 'react'
import * as Relay from 'react-relay'
import Icon from '../../../components/Icon/Icon'
import {Link} from 'react-router'
import {getFieldTypeName} from '../../../utils/valueparser'
import {isScalar} from '../../../utils/graphql'
import {Field} from '../../../types/types'
import {debounce} from '../../../utils/utils'
import {classnames} from '../../../utils/classnames'
const classes: any = require('./HeaderCell.scss')

interface Props {
  field: Field
  sortOrder?: string
  toggleSortOrder: () => void
  updateFilter: (value: string) => void
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
          <div className={classnames(classes.fieldName, {
            [classes.nonsystem]: !field.isSystem,
          })}>
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
