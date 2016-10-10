import * as React from 'react'
import {connect} from 'react-redux'
import {Model, Project} from '../../../../types/types'
import NewRow from '../NewRow'
import NewRowInactive from '../NewRowInactive'
import {Grid} from 'react-virtualized'
import {ActionRowState} from '../../../../types/databrowser/actionrow'
import Tether from '../../../../components/Tether/Tether'

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
      <Tether
        steps={[{
          step: this.props.newRowActive ? null : 'STEP3_CLICK_ADD_NODE1',
          title: 'Create a Node',
          description: 'Items in your data belonging to a certain model are called nodes. Create a new post node and provide values for the "imageUrl" and "description" fields.', // tslint:disable-line
        }, {
          step: this.props.newRowActive ? null : 'STEP3_CLICK_ADD_NODE2',
          title: `Awesome! Let's create one more.`,
          description: 'Hint: You can also use your keyboard to navigate between fields (Tab or Shift+Tab) and submit (Enter).', // tslint:disable-line
        }]}
        offsetX={315}
        offsetY={5}
        width={351}
        horizontal='left'
      >
          <Grid
            width={this.props.width - (40 - 1)}
            height={this.props.height}
            style={{
              overflow: 'visible',
              position: 'absolute',
              left: 40,
              width: 'auto',
              top: this.props.headerHeight,
              zIndex: 2
            }}
            cellStyle={{position: 'absolute'}}
            rowHeight={this.props.height}
            columnCount={1}
            columnWidth={this.props.width - (40 - 1)}
            rowCount={1}
            cellRenderer={this.renderAddCell}
          />
      </Tether>
    )
  }
}

const MappedDataActionRow = connect(state => {
  return {
    newRowActive: state.databrowser.ui.newRowActive,
  }
})(NewNodeRow)

export default MappedDataActionRow
