import * as React from 'react'
import TetherComponent from 'react-tether'
import {connect} from 'react-redux'
import {Step,GettingStartedState} from '../../types/gettingStarted'
import {classnames} from '../../utils/classnames'
import CopyToClipboard from 'react-copy-to-clipboard'
const classes: any = require('./Tether.scss')

interface TetherStep {
  step: Step
  title: string
  description?: string
  buttonText?: string
  copyText?: string
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
  onMouseEnter: () => any
  onMouseLeave: () => any
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
    const step = this.props.steps.find((s) => this.props.gettingStartedState.isCurrentStep(s.step))
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
                                'br-2',
                                isBottom ? classes.bottom : classes.top,
                                isLeft ? classes.left : classes.right)}
          style={{width: this.props.width, zIndex: 9}}
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}
        >
          <div className={classes.title}>
            {step.title}
          </div>
          {step.description &&
          <div className={`${classes.description} lh-1-4`}>
            {step.description}
          </div>
          }
          {step.buttonText &&
            <CopyToClipboard
              text={step.copyText}
            >
            <div className='flex justify-center mb3 mt2'>
              <div
                className='pa2 br2 bg-transparent tc ba b--white white pointer dim'
              >
                {step.buttonText}
              </div>
            </div>
            </CopyToClipboard>
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
