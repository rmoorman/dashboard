import * as React from 'react'
import * as Relay from 'react-relay'
import Cell from './Cell'
import {Model} from '../../../types/types'
import {compareFields, getFirstInputFieldIndex, getDefaultFieldValues} from '../utils'
const classes: any = require('./NewRow.scss')

interface Props {
  model: Model
  projectId: string
  columnWidths: {[key: string]: number}
  add: (fieldValues: { [key: string]: any }) => void
  cancel: () => void
}

interface State {
  fieldValues: { [key: string]: any }
  shouldFocus?: boolean
}

class NewRow extends React.Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {
      fieldValues: getDefaultFieldValues(props.model.fields.edges.map((edge) => edge.node)),
      shouldFocus: true,
    }
  }

  render() {
    const fields = this.props.model.fields.edges
      .map((edge) => edge.node)
      .sort(compareFields)
    const inputIndex = getFirstInputFieldIndex(fields)

    return (
      <div className={classes.root}>
        <div className={classes.empty}/>
        {fields.map((field, index) => {
          return (
          <div
            key={field.id}
            style={{width: this.props.columnWidths[field.name]}}
            onKeyDown={this.handleKeyDown}
          >
              <Cell
                needsFocus={this.state.shouldFocus ? index === inputIndex : false}
                addnew={true}
                field={field}
                width={this.props.columnWidths[field.name]}
                update={this.update}
                value={this.state.fieldValues[field.name] ? this.state.fieldValues[field.name].value : ''}
                cancel={this.props.cancel}
                projectId={this.props.projectId}
                reload={() => null}
              />
            </div>
          )
        })}
        <div className={classes.buttons}>
          <button onClick={this.add}>Add</button>
          <button onClick={this.props.cancel}>Cancel</button>
        </div>
      </div>
    )
  }

  private handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.add()
    } else if (e.keyCode === 27) {
      this.props.cancel()
    }
  }

  private add = () => {
    const allRequiredFieldsGiven = this.state.fieldValues
      .mapToArray((fieldName, obj) => obj)
      .reduce((acc, {field, value}) => acc && (value !== null || !field.isRequired), true)
    if (allRequiredFieldsGiven) {
      this.props.add(this.state.fieldValues)
    }
  }

  private update = (value, field, callback) => {
    const {fieldValues} = this.state
    fieldValues[field.name].value = value
    this.setState({fieldValues, shouldFocus: false} as State)
    callback()
  }

}

export default Relay.createContainer(NewRow, {
  fragments: {
    model: () => Relay.QL`
      fragment on Model {
        fields(first: 1000) {
          edges {
            node {
              id
              name
              defaultValue
              enumValues
              typeIdentifier
              isList
              ${Cell.getFragment('field')}
            }
          }
        }
      }
    `,
  },
})
