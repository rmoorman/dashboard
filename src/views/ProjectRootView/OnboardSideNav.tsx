import * as React from 'react'
import {classnames} from '../../utils/classnames'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {nextStep, skip} from '../../actions/gettingStarted'
import {GettingStartedState} from '../../types/gettingStarted'
import Icon from '../../components/Icon/Icon'

interface Props {
  params: any
  router: any
  gettingStartedState: GettingStartedState
  nextStep: () => Promise<any>
  skip: () => Promise<any>
}

interface StepData {
  index: number
  text: string
}

class OnboardSideNav extends React.Component<Props, {}> {

  render() {
    const progress = 100 * this.props.gettingStartedState.progress.index / 5

    return (
      <div className='flex flex-column'>
        <div style={{ flex: '0 0 auto' }} className='relative'>
          <div
            className='absolute o-30 pointer'
            style={{ top: 25, right: 25 }}
            onClick={this.skipGettingStarted}
          >
            <Icon width={13} height={13} color='#000' src={require('assets/new_icons/close.svg')}/>
          </div>
          <div className='f-25 black-40 fwb mh-25 mv-16'>Getting Started</div>
          <div className='f-16 black-50 mh-25 mb-38 lh-1-4'>
            Building Instagram in minutes. Define data structure, create posts, test the backend and implement it.
          </div>
          <div
            className='br-1 absolute'
            style={{ background: '#009E4F', height: 14, bottom: -7, left: 16, right: 16 }}
          >
            <div
              className='h-100 bg-white br-1'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div style={{ flex: '1 0 auto' }} className='bg-black-05 w-100 flex flex-column justify-between'>
          <div className='ph-16 pv-38'>
            {this.renderStep({
              index: 1,
              text: 'Create a „Post“-Model',
            })}
            {this.renderStep({
              index: 2,
              text: 'Define the Model',
            })}
            {this.renderStep({
              index: 3,
              text: 'Create 2 Posts',
            })}
            {this.renderStep({
              index: 4,
              text: 'Test in Playground',
            })}
            {this.renderStep({
              index: 5,
              text: 'Run example app',
            })}
          </div>
          <div>
            <div className='f-16 black-50 mh-25 mb-25 lh-1-4'>
              Got stuck? Please contact us, we are always trying to improve and love to help!
            </div>
            <img
              className='db'
              style={{ marginLeft: 93, marginBottom: 61 }}
              src={require('../../assets/graphics/onboarding-chat.svg')}
            />
          </div>
        </div>
      </div>
    )
  }

  private renderStep = (data: StepData) => {
    const { progress } = this.props.gettingStartedState
    const isActive = progress.index === data.index
    const isComplete = progress.index > data.index
    return (
      <div
        className={classnames(
          'flex black-30 mb-16 items-center w-100',
          {
            'white': isActive,
            'strike': isComplete,
          }
        )}
      >
        <div
          style={{ width: 23, height: 23, borderRadius: 11.5, fontSize: 12 }}
          className={classnames(
            'flex items-center justify-center ',
            {
              'accent': isActive || isComplete,
              'o-40': !isActive,
              'bg-white': isActive,
              'bg-black-50': isComplete,
              'black ba b--black': !isComplete && !isActive,
            }
          )}
        >
          {data.index}
        </div>
        <div className='mh-16'>{data.text}</div>
        {isActive && progress.total > 0 &&
        <div
          className='bg-black-10 white-60 fwb'
          style={{ fontSize: 12, padding: 4, marginLeft: 'auto' }}
        >
          {progress.done}/{progress.total}
        </div>
        }
        {isComplete &&
          <div style={{ marginLeft: 'auto' }}>
            <Icon
              width={13}
              height={13}
              color='#fff'
              src={require('assets/icons/check.svg')}
            />
          </div>
        }
      </div>
    )
  }

  // private renderGettingStarted = () => {
  //
  //   const firstStepOnClick = () => {
  //     if (this.props.gettingStartedState.isCurrentStep('STEP1_OVERVIEW')) {
  //       this.props.nextStep()
  //     }
  //   }
  //
  //   const secondStepOnClick = () => {
  //     if (this.props.gettingStartedState.isCurrentStep('STEP5_GOTO_DATA_TAB')) {
  //       this.props.nextStep()
  //     }
  //   }
  //
  //   const thirdStepOnClick = () => {
  //     if (this.props.gettingStartedState.isCurrentStep('STEP8_GOTO_GETTING_STARTED')) {
  //       this.props.nextStep()
  //     }
  //   }
  //
  //   const gettingStartedStepClass = (index) => {
  //     if (this.props.gettingStartedState.progress === index) {
  //       return classes.gettingStartedStepActive
  //     } else if (this.props.gettingStartedState.progress > index) {
  //       return classes.gettingStartedStepDone
  //     } else {
  //       return classes.gettingStartedStepDisabled
  //     }
  //   }
  //
  //   const showsGettingStarted = this.props.router.isActive(`/${this.props.params.projectName}/getting-started`)
  //
  //   return (
  //     <div className={`${showsGettingStarted ? classes.active : ''}`}>
  //       <div className={classes.gettingStarted}>
  //         <Link
  //           to={`/${this.props.params.projectName}/getting-started`}
  //           className={classes.gettingStartedTitle}
  //           onClick={thirdStepOnClick}
  //         >
  //           <Icon width={19} height={19} src={require('assets/icons/cake.svg')}/>
  //           <span>Getting Started</span>
  //         </Link>
  //         <div className={classes.gettingStartedList}>
  //           <div className={gettingStartedStepClass(1)}>
  //             <Link
  //               to={`/${this.props.params.projectName}/getting-started`}
  //               onClick={firstStepOnClick}
  //             >
  //               1. Create Post model
  //             </Link>
  //           </div>
  //           <div className={gettingStartedStepClass(2)}>
  //             <Link
  //               to={`/${this.props.params.projectName}/models/Post/browser`}
  //               onClick={secondStepOnClick}
  //             >
  //               2. Add some data
  //             </Link>
  //           </div>
  //           <div className={gettingStartedStepClass(3)}>
  //             <Tether
  //               steps={{
  //                 STEP8_GOTO_GETTING_STARTED: 'You\'re almost done. Let\'s run an example app now...',
  //               }}
  //               offsetY={-5}
  //               width={260}
  //             >
  //               <Link
  //                 to={`/${this.props.params.projectName}/getting-started`}
  //                 onClick={thirdStepOnClick}
  //               >
  //                 3. Run example app
  //               </Link>
  //             </Tether>
  //           </div>
  //           <div onClick={this.skipGettingStarted} className={classes.gettingStartedSkip}>
  //             Skip getting started
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  private skipGettingStarted = () => {
    if (window.confirm('Do you really want skip the getting started tour?')) {
      this.props.skip()
        .then(() => {
          this.props.router.replace(`/${this.props.params.projectName}/models`)
        })
    }
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({nextStep, skip}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(OnboardSideNav))
