import * as React from 'react'
import TetherComponent from 'react-tether'
import { connect } from 'react-redux'
const classes: any = require('./Tether.scss')

interface Props {
  steps: { [key: string]: string }
  children: Element
  gettingStartedState: any
  offsetX?: number
  offsetY?: number
  width?: number
  side?: string
}

class Tether extends React.Component<Props, {}> {

  static defaultProps = {
    offsetX: 0,
    offsetY: 0,
    width: 220,
    side: 'bottom',
  }

  render () {
    const step = this.props.steps[this.props.gettingStartedState.step]
    const isBottom = this.props.side === 'bottom'

    return (
      <TetherComponent
        offset={`${this.props.offsetY}px ${this.props.offsetX}px`}
        attachment={`${isBottom ? 'top' : 'bottom'} left`}
        targetAttachment={`${isBottom ? 'bottom' : 'top'} left`}
      >
        {this.props.children}
        {step &&
          <div
            className={`${classes.tether} ${isBottom ? classes.bottom : classes.top}`}
            style={{width: this.props.width, zIndex: 9}}
          >
            {step}
          </div>
        }
      </TetherComponent>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

export default connect(mapStateToProps)(Tether)
