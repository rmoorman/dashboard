import * as React from 'react'
import {connect} from 'react-redux'
import {Model, Project} from '../../../../types/types'
import NewRow from '../NewRow'
import NewRowInactive from '../NewRowInactive'
import {Grid} from 'react-virtualized'
import {ActionRowState} from '../../../../types/databrowser/actionrow'

interface Props {
  width: number
  height: number
  headerHeight: number
  model: Model
  project: Project
  addNewNode: () => any
  hideNewRow: () => any
  fieldColumnWidths: {[key: string]: number}
  actionRow?: ActionRowState
  newRowActive: boolean
}

interface State {

}

class NewNodeRow extends React.Component<Props, State> {
  renderAddCell = () => {
    if (this.props.newRowActive) {
        return (
          <NewRow
            model={this.props.model}
            projectId={this.props.project.id}
            columnWidths={this.props.fieldColumnWidths}
            add={this.props.addNewNode}
            cancel={this.props.hideNewRow}
            width={this.props.width}
          />
        )
    }

    return (
      <NewRowInactive
        model={this.props.model}
        columnWidths={this.props.fieldColumnWidths}
        height={this.props.height}
      />
    )
  }
  render() {
    return (
      <Grid
        width={this.props.width}
        height={this.props.height}
        style={{
                  overflow: 'visible',
                  position: 'absolute',
                  left: 40,
                  width: 'auto',
                  top: this.props.headerHeight,
                }}
        cellStyle={{position: 'absolute'}}
        rowHeight={this.props.height}
        columnCount={1}
        columnWidth={this.props.width}
        rowCount={1}
        cellRenderer={this.renderAddCell}
      />
    )
  }
}

const MappedDataActionRow = connect(state => {
  return {
    newRowActive: state.databrowser.ui.newRowActive,
  }
})(NewNodeRow)

export default MappedDataActionRow
