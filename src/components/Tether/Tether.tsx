import * as React from 'react'
import TetherComponent from 'react-tether'
import {connect} from 'react-redux'
import {Step,GettingStartedState} from '../../types/gettingStarted'
import {classnames} from '../../utils/classnames'
const classes: any = require('./Tether.scss')

interface TetherStep {
  step: Step
  title: string
  description?: string
}

interface Props {
  steps: TetherStep[]
  children: Element
  gettingStartedState: GettingStartedState
  offsetX?: number
  offsetY?: number
  width?: number
  side?: string
  horizontal?: string
  zIndex?: number
}

class Tether extends React.Component<Props, {}> {

  static defaultProps = {
    offsetX: 0,
    offsetY: 0,
    width: 220,
    side: 'bottom',
    horizontal: 'left',
  }

  render() {
    const step = this.props.steps.find((s) => s.step === this.props.gettingStartedState.step)
    const isBottom = this.props.side === 'bottom'
    const isLeft = this.props.horizontal === 'left'

    return (
      <TetherComponent
        style={{
          zIndex: this.props.zIndex ? this.props.zIndex : 999,
        }}
        offset={`${this.props.offsetY}px ${this.props.offsetX}px`}
        attachment={`${isBottom ? 'top' : 'bottom'} ${this.props.horizontal}`}
        targetAttachment={`${isBottom ? 'bottom' : 'top'} ${this.props.horizontal}`}
      >
        {this.props.children}
        {step &&
        <div
          className={classnames(classes.tether,
                                isBottom ? classes.bottom : classes.top,
                                isLeft ? classes.left : classes.right)}
          style={{width: this.props.width, zIndex: 9}}
        >
          <div className={classes.title}>
            {step.title}
          </div>
          {step.description &&
          <div className={classes.description}>
            {step.description}
          </div>
          }
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
