import * as React from 'react'
import {connect} from 'react-redux'
import {Model, Project} from '../../../types/types'
import {ActionRowState} from '../../../types/databrowser/actionrow'
import NewNodeRow from './DataActionRow/NewNodeRow'

interface Props {
  width: number
  height: number
  headerHeight: number
  model: Model
  project: Project
  addNewNode: () => any
  hideNewRow: () => any
  actionRow: ActionRowState
  fieldColumnWidths: number
}

interface State {

}

class DataActionRow extends React.Component<Props, State> {
  render() {
    const { actionRow } = this.props

    switch (actionRow) {
      case ActionRowState.NewNode:
        return (
            <NewNodeRow
              {...this.props}
            />
        )
    }
  }
}

const MappedDataActionRow = connect(state => {
  const { actionRow } = state.databrowser.ui
  return { actionRow }
})(DataActionRow)

export default MappedDataActionRow
