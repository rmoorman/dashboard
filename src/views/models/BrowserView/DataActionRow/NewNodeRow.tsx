import * as React from 'react'
import {connect} from 'react-redux'
import {Model, Project} from '../../../../types/types'
import NewRow from '../NewRow'
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
}

interface State {

}

class NewNodeRow extends React.Component<Props, State> {
  renderAddCell = () => {
    return (
      <NewRow
        model={this.props.model}
        projectId={this.props.project.id}
        columnWidths={this.props.fieldColumnWidths}
        add={this.props.addNewNode}
        cancel={this.props.hideNewRow}
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
                  left: 0,
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

const MappedDataActionRow = connect()(NewNodeRow)

export default MappedDataActionRow
