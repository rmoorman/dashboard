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
import shallowCompare from 'react-addons-shallow-compare'
import {
  nextCell, previousCell, nextRow, previousRow, stopEditCell, editCell, unselectCell, selectCell,
} from '../../../actions/databrowser/ui'
const classes: any = require('./Cell.scss')

export type UpdateCallback = (success: boolean) => void

interface Props {
  field: Field
  projectId: string
  nodeId: string
  value: any
  update: (value: TypedValue, field: Field, callback: UpdateCallback) => void
  reload: () => void
  rowSelected?: boolean
  isReadonly: boolean
  addnew: boolean
  backgroundColor: string
  needsFocus?: boolean
  showNotification: ShowNotificationCallback
  rowIndex: number
  editing: boolean
  selected: boolean
  selectCell: (position: [number, string]) => any
  unselectCell: () => any
  editCell: (position: [number, string]) => any
  stopEditCell: () => any

  nextCell: (fields: Field[]) => any
  previousCell: (fields: Field[]) => any
  nextRow: (fields: Field[]) => any
  previousRow: (fields: Field[]) => any

  position: [number, string]
  fields: Field[]
}

class Cell extends React.Component<Props, {}> {

  private escaped: boolean

  constructor(props: Props) {
    super(props)

    this.escaped = false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render(): JSX.Element {
    const rootClassnames = classnames({
      [classes.root]: true,
      [classes.null]: this.props.value === null,
      [classes.editing]: this.props.editing,
      [classes.selected]: this.props.selected,
      [classes.rowselected]: this.props.rowSelected,
    })


    return (
      <div
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'visible',
        }}
        className={classnames(rootClassnames, {
          [classes.selected]: this.props.selected,
        })}
        onClick={() => this.props.selectCell(this.props.position)}
        onDoubleClick={() => this.startEditing()}
      >
        {this.renderContent()}
      </div>
    )
  }
  // onClick={() => this.props.addnew ? this.startEditing() : this.props.selectCell(this.props.position)}

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

    this.props.update(value, this.props.field, () => {
      if (keepEditing) {
        this.props.editCell(this.props.position)
      } else {
        this.props.stopEditCell()
      }
    })
  }

  private onKeyDown = (e: any): void => {
    if (e.keyCode === 13 && e.shiftKey) {
      return
    }

    switch (e.keyCode) {
      case 37:
        this.save(stringToValue(e.target.value, this.props.field))
        this.props.previousCell(this.props.fields)
        e.preventDefault()
        break
      case 38:
        this.save(stringToValue(e.target.value, this.props.field))
        this.props.previousRow(this.props.fields)
        e.preventDefault()
        break
      case 9:
      case 39:
        this.save(stringToValue(e.target.value, this.props.field))
        this.props.nextCell(this.props.fields)
        e.preventDefault()
        break
      case 40:
        this.save(stringToValue(e.target.value, this.props.field))
        this.props.nextRow(this.props.fields)
        e.preventDefault()
        break
      case 13:
        this.save(stringToValue(e.target.value, this.props.field))
        e.preventDefault()
        break
      case 27:
        this.escaped = true
        this.cancel()
        e.preventDefault()
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

const MappedCell = connect((state, props) => {
  const {rowIndex, field} = props
  const { selectedCell, editing } = state.databrowser.ui

  if (selectedCell[0] === rowIndex && selectedCell[1] === field.name) {
    return {
      selected: true,
      editing,
      position: [rowIndex, field.name],
    }
  }

  return {
    selected: false,
    editing: false,
    position: [rowIndex, field.name],
  }
}, {
  selectCell,
  unselectCell,
  editCell,
  stopEditCell,
  nextCell,
  previousCell,
  nextRow,
  previousRow,
})(Cell)


export default Relay.createContainer(MappedCell, {
  fragments: {
    field: () => Relay.QL`
      fragment on Field {
        id
        name
        isList
        isRequired
        typeIdentifier
        isReadonly
        enumValues
        relatedModel {
          ${NodeSelector.getFragment('relatedModel')}
        }
        ${RelationsPopup.getFragment('originField')}
      }
    `, // Add isReadOnly back to the schema when backend implemented
  },
})
