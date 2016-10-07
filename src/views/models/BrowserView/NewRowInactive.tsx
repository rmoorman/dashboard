import * as React from 'react'
import {connect} from 'react-redux'
import {toggleNewRow} from '../../../actions/databrowser/ui'
import {Model} from '../../../types/types'
import Icon from '../../../components/Icon/Icon'
import {classnames} from '../../../utils/classnames'
const classes: any = require('./NewRowInactive.scss')

interface Props {
  columnWidths: {[key: string]: number}
  model: Model
  toggleNewRow: () => any
  height: number
}

class NewRowInactive extends React.Component<Props, {}> {

  render() {
    const fields = this.props.model.fields.edges
      .map((edge) => edge.node)

    return (
      <div className={classes.root} onClick={this.props.toggleNewRow}>
        {fields.map(function(field, index)  {
          return (
            <div
              key={field.id}
              style={{
                width: this.props.columnWidths[field.name] + (index === fields.length - 1 ? 1 : 0),
                height: this.props.height,
              }}
              className={classnames(classes.cell, {
                [classes.last]: index === fields.length - 1
              })}
              onKeyDown={this.handleKeyDown}
            >
              {index === 0 && (
                <div className={classes.add}>
                  <Icon
                    width={12}
                    height={12}
                    src={require('assets/new_icons/add-plain.svg')}
                  />
                  <span>add new node ...</span>
                </div>
              )}
            </div>
          )
        }.bind(this))}
        <div
          style={{
                width: 250,
                height: this.props.height,
              }}
          className={classes.loading}
        >
          <div></div>
        </div>
      </div>
    )
  }

}
export default connect(null, {
  toggleNewRow,
})(NewRowInactive)
