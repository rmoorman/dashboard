import * as React from 'react'
import * as Relay from 'react-relay'
import Loading from '../../../components/Loading/Loading'
import {classnames} from '../../../utils/classnames'
import {valueToString, stringToValue} from '../../../utils/valueparser'
import {Field} from '../../../types/types'
import NodeSelector from '../../../components/NodeSelector/NodeSelector'
import RelationsPopup from './RelationsPopup'
import {CellRequirements, getEditCell} from './Cell/cellgenerator'
import {TypedValue, ShowNotificationCallback} from '../../../types/utils'
import {isNonScalarList} from '../../../utils/graphql'
import {connect} from 'react-redux'
import {showNotification} from '../../../actions/notification'
import {bindActionCreators} from 'redux'
const classes: any = require('./Cell.scss')

export type UpdateCallback = (success: boolean) => void

interface Props {
  field: Field
  projectId: string
  nodeId: string
  value: any
  update: (value: TypedValue, field: Field, callback: UpdateCallback) => void
  reload: () => void
  isSelected: boolean
  addnew: boolean
  backgroundColor: string
  needsFocus?: boolean
  showNotification: ShowNotificationCallback
}

interface State {
  editing: boolean
  loading: boolean
}

class Cell extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      editing: false,
      loading: false,
    }
  }

  render(): JSX.Element {
    const rootClassnames = classnames({
      [classes.root]: true,
      [classes.null]: this.props.value === null,
      [classes.editing]: this.state.editing,
    })

    return (
      <div
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: this.props.isSelected ? '#EEF9FF' : this.props.backgroundColor,
          overflow: 'visible',
        }}
        className={rootClassnames}
        onClick={() => this.props.addnew ? this.startEditing() : null}
        onDoubleClick={() => this.props.addnew ? null : this.startEditing()}
      >
        {this.renderContent()}
      </div>
    )
  }

  private startEditing = (): void => {
    if (this.state.editing) {
      return
    }
    // if (this.props.field.isReadOnly) {
    //   this.setState({editing: true} as State)
    // }
  }

  private cancel = (shouldReload: boolean = false): void => {
    this.setState({editing: false} as State)
    if (shouldReload) {
      this.props.reload()
    }
  }

  private save = (value: TypedValue, keepEditing: boolean = false): void => {
    if (this.props.field.isRequired && value === null) {
      const valueString = valueToString(value, this.props.field, true)
      this.props.showNotification({
        message: `'${valueString}' is not a valid value for field ${this.props.field.name}`,
        level: 'error',
      })
      this.setState({editing: keepEditing} as State)
      return
    }

    if (this.props.value === value) {
      this.setState({editing: keepEditing} as State)
      return
    }

    this.props.update(value, this.props.field, () => {
      this.setState({
        editing: keepEditing,
        loading: false,
      } as State)
    })
  }

  private onKeyDown = (e: any): void => {
    if (e.keyCode === 13 && e.shiftKey) {
      return
    }
    switch (e.keyCode) {
      case 13:
        this.save(stringToValue(e.target.value, this.props.field))
        break
      case 27:
        this.cancel()
        break
    }
  }

  private renderNew = (): JSX.Element => {
    const invalidStyle = classnames([classes.value, classes.id])
    // if (this.props.field.isReadOnly) {
    //   return (
    //     <span className={invalidStyle}>{this.props.field.name} will be generated</span>
    //   )
    // }

    if (isNonScalarList(this.props.field)) {
      return (
        <span className={invalidStyle}>Should be added later</span>
      )
    }

    return this.renderExisting()
  }

  private renderExisting = (): JSX.Element => {
    if (this.state.editing) {
      const reqs: CellRequirements = {
        field: this.props.field,
        value: this.props.value,
        projectId: this.props.projectId,
        nodeId: this.props.nodeId,
        methods: {
          save: this.save,
          onKeyDown: this.onKeyDown,
          cancel: this.cancel,
        },
      }
      return getEditCell(reqs)
    }
    const valueString = valueToString(this.props.value, this.props.field, true)
    // Do not use 'defaultValue' because it won't force an update after value change
    return (
      <input
        className={classes.value}
        value={valueString}
        onChange={() => null}
        onFocus={() => this.startEditing()}
        autoFocus={this.props.needsFocus}
        // style={{pointerEvents: this.props.field.isReadOnly ? '' : 'none'}}
      />
    )
  }

  private renderContent(): JSX.Element {
    if (this.state.loading) {
      return (
        <div className={classes.loading}>
          <Loading color='#B9B9C8'/>
        </div>
      )
    }

    if (this.props.addnew) {
      return this.renderNew()
    } else {
      return this.renderExisting()
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({showNotification}, dispatch)
}

const MappedCell = connect(null, mapDispatchToProps)(Cell)

export default Relay.createContainer(MappedCell, {
  fragments: {
    field: () => Relay.QL`
      fragment on Field {
        id
        name
        isList
        isRequired
        ${/*isReadOnly*/ ''}
        typeIdentifier
        enumValues
        relatedModel {
          ${NodeSelector.getFragment('relatedModel')}
        }
        ${RelationsPopup.getFragment('originField')}
      }
    `,
  },
})
