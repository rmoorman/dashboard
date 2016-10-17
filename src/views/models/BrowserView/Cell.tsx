import * as React from 'react'
import * as Relay from 'react-relay'
import {classnames} from '../../../utils/classnames'
import {valueToString, stringToValue} from '../../../utils/valueparser'
import {Field} from '../../../types/types'
import NodeSelector from '../../../components/NodeSelector/NodeSelector'
import RelationsPopup from './RelationsPopup'
import {CellRequirements, getEditCell} from './Cell/cellgenerator'
import {TypedValue, ShowNotificationCallback} from '../../../types/utils'
import {isNonScalarList} from '../../../utils/graphql'
import {connect} from 'react-redux'
import {
  nextCell, previousCell, nextRow, previousRow, stopEditCell, editCell, unselectCell, selectCell,
} from '../../../actions/databrowser/ui'
import {ReduxThunk, ReduxAction} from '../../../types/reducers'
import {GridPosition} from '../../../types/databrowser/ui'
const classes: any = require('./Cell.scss')

export type UpdateCallback = (success: boolean) => void

interface Props {
  field: Field
  projectId: string
  nodeId: string
  value: any
  update: (value: TypedValue, field: Field, callback: UpdateCallback) => void
  reload: () => void
  // rowSelected is the selection for deletion
  rowSelected?: boolean
  // rowHasCursor means the cursor is in the row
  rowHasCursor: boolean
  isReadonly: boolean
  addnew: boolean
  backgroundColor: string
  needsFocus?: boolean
  showNotification: ShowNotificationCallback
  rowIndex: number
  editing: boolean
  selected: boolean
  selectCell: (position: GridPosition) => ReduxAction
  unselectCell: () => ReduxAction
  editCell: (position: GridPosition) => ReduxAction
  stopEditCell: () => ReduxAction
  newRowActive: boolean

  nextCell: (fields: Field[]) => ReduxThunk
  previousCell: (fields: Field[]) => ReduxThunk
  nextRow: (fields: Field[]) => ReduxThunk
  previousRow: (fields: Field[]) => ReduxThunk

  position: GridPosition
  fields: Field[]

  loaded: boolean[]
}

export class Cell extends React.PureComponent<Props, {}> {

  refs: {
    [key: string]: any
    container: any // needs to be any, as scrollIntoViewIfNeeded is not yet there
  }

  private escaped: boolean

  constructor(props: Props) {
    super(props)

    this.escaped = false
  }

  render(): JSX.Element {
    const rootClassnames = classnames({
      [classes.root]: true,
      [classes.null]: this.props.value === null,
      [classes.editing]: this.props.editing,
      [classes.selected]: this.props.selected,
      [classes.rowselected]: this.props.rowSelected,
      [classes.rowhascursor]: this.props.rowHasCursor && !this.props.addnew,
    })

    return (
      <div
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'visible',
        }}
        className={rootClassnames}
        onClick={() => (this.props.addnew || this.props.selected)
          ? this.startEditing() : this.props.selectCell(this.props.position)}
        onDoubleClick={() => this.startEditing()}
        ref='container'
      >
        {this.renderContent()}
      </div>
    )
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected === true && this.props.selected === false) {
      this.refs.container.scrollIntoViewIfNeeded()
    }
  }

  private startEditing = (): void => {
    if (this.props.editing) {
      return
    }
    if (!this.props.field.isReadonly) {
      this.props.editCell(this.props.position)
    }
  }

  private cancel = (shouldReload: boolean = false): void => {
    this.props.stopEditCell()
    if (shouldReload) {
      this.props.reload()
    }
  }

  private save = (value: TypedValue, keepEditing: boolean = false): void => {
    if (this.props.isReadonly) {
      return
    }

    if (this.escaped) {
      this.escaped = false
      return
    }

    if (this.props.field.isRequired && value === null) {
      const valueString = valueToString(value, this.props.field, true)
      this.props.showNotification({
        message: `'${valueString}' is not a valid value for field ${this.props.field.name}`,
        level: 'error',
      })
      if (keepEditing) {
        this.props.editCell(this.props.position)
      } else {
        this.props.stopEditCell()
      }
      return
    }

    if (this.props.value === value) {
      if (keepEditing) {
        this.props.editCell(this.props.position)
      } else {
        this.props.stopEditCell()
      }
      return
    }

    if (keepEditing) {
      this.props.editCell(this.props.position)
    } else {
      this.props.stopEditCell()
    }

    this.props.update(value, this.props.field, () => {
      //
    })
  }

  private stopEvent = (e: any) => {
    e.preventDefault()
    if (typeof e.stopImmediatePropagation === 'function') {
      e.stopImmediatePropagation()
    }
    if (typeof e.stopPropagation === 'function') {
      e.stopPropagation()
    }
  }

  private onKeyDown = (e: any): void => {
    if (e.keyCode === 13 && e.shiftKey) {
      return
    }

    // stopEvent is needed, as the event could bubble up to the keyDown listener we attached
    // in the BrowserView
    // for some events, stopImmediatePropagation is needed. But not all events provide that interface,
    // as we get browser based events and synthetic React events
    // so we have so check for the existence of the function

    switch (e.keyCode) {
      case 37:
        this.stopEvent(e)
        this.save(stringToValue(e.target.value, this.props.field))
        this.props.previousCell(this.props.fields)
        break
      case 38:
        this.stopEvent(e)
        this.save(stringToValue(e.target.value, this.props.field))
        this.props.previousRow(this.props.fields)
        break
      case 9:
      case 39:
        this.stopEvent(e)
        this.save(stringToValue(e.target.value, this.props.field))
        // go back for shift+tab
        if (e.shiftKey) {
          this.props.previousCell(this.props.fields)
        } else {
          this.props.nextCell(this.props.fields)
        }
        break
      case 40:
        this.stopEvent(e)
        this.save(stringToValue(e.target.value, this.props.field))
        this.props.nextRow(this.props.fields)
        break
      case 13:
        // in the new row case, the row needs the event, so let it bubble up
        if (!this.props.newRowActive) {
          this.stopEvent(e)
        }
        this.save(stringToValue(e.target.value, this.props.field))
        break
      case 27:
        this.stopEvent(e)
        this.escaped = true
        this.cancel()
        break
    }
  }

  private renderNew = (): JSX.Element => {
    const invalidStyle = classnames([classes.value, classes.id])
    if (this.props.field.isReadonly) {
      return (
        <span className={invalidStyle}>{this.props.field.name} will be generated</span>
      )
    }

    if (isNonScalarList(this.props.field)) {
      return (
        <span className={invalidStyle}>Should be added later</span>
      )
    }

    return this.renderExisting()
  }

  private renderExisting = (): JSX.Element => {
    if (this.props.editing) {
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
      <span
        className={classes.value}
        style={{
          cursor: this.props.field.isReadonly ? 'auto' : 'pointer',
        }}
        onKeyDown={this.onKeyDown}
      >{valueString}</span>
    )
  }

  private renderContent(): JSX.Element {
    if (this.props.addnew) {
      return this.renderNew()
    } else {
      return this.renderExisting()
    }
  }
}

const MappedCell = connect(
  (state, props) => {
    const {rowIndex, field, addnew} = props
    const { selectedCell, editing, newRowActive, writing } = state.databrowser.ui

    const cellEditing = !writing && (editing || ((field.isList) ? false : addnew))

    if (selectedCell.row === rowIndex && selectedCell.field === field.name) {
      return {
        selected: true,
        editing: cellEditing,
        position: {
          row: rowIndex,
          field: field.name,
        },
        newRowActive,
        rowHasCursor: selectedCell.row === rowIndex,
      }
    }

    return {
      selected: false,
      editing: false,
      position: {
        row: rowIndex,
        field: field.name,
      },
      newRowActive,
      rowHasCursor: selectedCell.row === rowIndex,
    }
  },
  {
    selectCell,
    unselectCell,
    editCell,
    stopEditCell,
    nextCell,
    previousCell,
    nextRow,
    previousRow,
  }
)(Cell)

export default Relay.createContainer(MappedCell, {
  fragments: {
    field: () => Relay.QL`
      fragment on Field {
        id
        name
        isList
        isRequired
        isReadonly
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
