import * as React from 'react'
import { CellProps } from './cells'
import ToggleButton from '../../../../components/ToggleButton/ToggleButton'
import { ToggleSide } from '../../../../components/ToggleButton/ToggleButton'

export default class BooleanCell extends React.Component<CellProps<boolean>, {}> {
  render() {
    return (
      <ToggleButton
        leftText='false'
        rightText='true'
        side={this.props.value ? ToggleSide.Right : ToggleSide.Left}
        onClickOutside={(side) => this.props.save(side === ToggleSide.Left ? false : true)}
        onKeyDown={this.props.onKeyDown}
      />
    )
  }
}
