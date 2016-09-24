import * as React from 'react'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {GettingStartedState} from '../../../types/gettingStarted'
import {nextStep, skip} from '../../../actions/gettingStarted'
import {closePopup} from '../../../actions/popup'

interface Props {
  params: any
  router: any
  nextStep: () => any
  skip: any
  gettingStartedState: GettingStartedState
  closePopup: any
  firstName: string
  id: string
}

class OnboardingPopup extends React.Component<Props, {}> {

  render() {
    return (
      <div className='flex justify-center items-center h-100 w-100 bg-white-50' style={{pointerEvents: 'all'}}>
        <div className='bg-white br-2 flex shadow-2' style={{ minWidth: 1000, maxWidth: 1200 }}>
          <div className='w-70 pa-60 tc fw1'>
            <div className='ttu' style={{ letterSpacing: 2 }}>Getting Started</div>
            <div className='f-38 lh-1-4 mv-25'>
              Let's build a GraphQL backend<br />
              for Instagram in 5 minutes
            </div>
            <div className='lh-1-4 mv-16'>
              Hi {this.props.firstName}, let’s get started building a backend for a simple Instagram clone.
              To keep our example light, we will reduce our Instagram posts to a picture and some hashtags.
              After we set up the data structure and create some posts,
              we are going to put the backend to work and query all posts, that contain a specific hashtag.
            </div>
            <div className='w-100 flex justify-center flex-column items-center'>
              <div
                className='br-2 mv-25 bg-accent white f-25 pv-16 ph-96 fw4 pointer ttu'
                onClick={this.getStarted}
              >
                Start Onboarding
              </div>
              <div
                className='mt3 underline pointer dim'
                onClick={this.skipGettingStarted}
              >
                Skip
              </div>
            </div>
          </div>
          <div className='w-30 bg-black-05 pv-38 flex justify-center'>
            <img src={require('../../../assets/graphics/instagram.svg')}/>
          </div>
        </div>
      </div>
    )
  }

  private skipGettingStarted = (): void => {
    if (window.confirm('Do you really want skip the getting started tour?')) {
      // TODO: fix this hack
      Promise.resolve(this.props.skip())
        .then(() => {
          this.props.closePopup(this.props.id)
          this.props.router.replace(`/${this.props.params.projectName}/models`)
        })
    }
  }

  private getStarted = (): void => {
    if (this.props.gettingStartedState.isCurrentStep('STEP0_OVERVIEW')) {
      this.props.closePopup(this.props.id)
      this.props.nextStep()
    }
  }

}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({nextStep, skip, closePopup}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OnboardingPopup))
