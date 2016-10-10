import * as React from 'react'
import * as Relay from 'react-relay'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {nextStep} from '../../../actions/gettingStarted'
import {GettingStartedState} from '../../../types/gettingStarted'
import {StateTree} from '../../../types/reducers'
import Cell from './Cell'
import {TypedValue} from '../../../types/utils'
import {Model, Field} from '../../../types/types'
import {getFirstInputFieldIndex, getDefaultFieldValues} from '../utils'
import Icon from '../../../components/Icon/Icon'
import {classnames} from '../../../utils/classnames'
const classes: any = require('./NewRow.scss')

interface Props {
  model: Model
  projectId: string
  columnWidths: {[key: string]: number}
  add: (fieldValues: { [key: string]: any }) => void
  cancel: () => void
  gettingStarted: GettingStartedState
  nextStep: () => any
  width: number
  loading: boolean
  loaded: any
  writing: boolean
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

  keyDown = (e: any) => {
    if (e.keyCode === 13) {
      this.add()
    }
  }


  render() {
    const fields = this.props.model.fields.edges
      .map((edge) => edge.node)

      // .sort(compareFields) // TODO remove this once field ordering is implemented
    const inputIndex = getFirstInputFieldIndex(fields)
    const loading = this.props.writing

    return (
      <div
        className={classnames(classes.root, {
          [classes.loading]: loading,
        })}
        style={{
          width: this.props.width - 250 - 40,
          border: '4px solid ' + this.props.loading ? 'red' : 'transparent',
        }}
        onKeyDown={this.keyDown}
      >
        {fields.map(function(field, index)  {
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
                fields={fields}
                width={this.props.columnWidths[field.name]}
                update={this.update}
                value={this.state.fieldValues[field.name] ? this.state.fieldValues[field.name].value : ''}
                cancel={this.props.cancel}
                projectId={this.props.projectId}
                reload={() => null}
                rowIndex={-1}
              />
            </div>
          )
        }.bind(this))}
        <div
          className={classnames(classes.buttons, {
            [classes.loading]: loading,
          })}
        >
          <button onClick={this.props.cancel}>
            <Icon
              width={24}
              height={24}
              src={require('assets/new_icons/remove.svg')}
              className={classes.cancel}
            />
          </button>
          <button onClick={this.add}>
            <Icon
              width={24}
              height={24}
              src={require('assets/new_icons/check.svg')}
              className={classes.add}
            />
          </button>
        </div>
      </div>
    )
  }

  private add = () => {
    // don't add when we're loading already new data
    if (this.props.writing) {
      return
    }
    const allRequiredFieldsGiven = this.state.fieldValues
      .mapToArray((fieldName, obj) => obj)
      .reduce((acc, {field, value}) => acc && (value !== null || !field.isRequired), true)
    if (allRequiredFieldsGiven) {
      this.props.add(this.state.fieldValues)
    }
  }

  private update = (value: TypedValue, field: Field, callback) => {
    if (this.props.gettingStarted.isCurrentStep('STEP3_CLICK_ENTER_IMAGEURL') &&
        field.name === 'imageUrl') {
      this.props.nextStep()
    }

    const {fieldValues} = this.state
    fieldValues[field.name].value = value
    this.setState({fieldValues, shouldFocus: false} as State)
    callback()
  }

}

const mapStateToProps = (state: StateTree) => {
  return {
    gettingStarted: state.gettingStarted.gettingStartedState,
    writing: state.databrowser.ui.writing,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ nextStep }, dispatch)
}

const MappedNewRow = connect(mapStateToProps, mapDispatchToProps)(NewRow)

export default Relay.createContainer(MappedNewRow, {
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
              isReadonly
              ${Cell.getFragment('field')}
            }
          }
        }
      }
    `,
  },
})
