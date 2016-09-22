import * as React from 'react'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {GettingStartedState} from '../../types/gettingStarted'
import { nextStep, skip } from '../../actions/gettingStarted'
import { closePopup } from '../../actions/popup'

interface Props {
  params: any
  router: any
  nextStep: any
  skip: any
  gettingStartedState: GettingStartedState
  closePopup: any
  firstName: string
}

class OnboardingView extends React.Component<Props, {}> {

  render() {
    return (
      <div className='flex justify-center items-center h-100 w-100 bg-black-50'>
        <div className='pa4 bg-white br3 flex'>
          <div className='w-80'>
          <div>🙌</div>
          <div>
            <h2><strong>Hi {this.props.firstName}</strong>, welcome to our Dashboard.</h2>
            <p>
              To make your start a bit easier, we have prepared a little tour for you.
              </p>
            <p>
              It will take about 3 minutes and show you the basic features<br />
              by creating a GraphQL backend for an Instagram clone.
              </p>
          </div>
          <div className='w-100 flex justify-center flex-column items-center'>
            <div
              className='br2 ba b--green f3 green tc pa2 pointer ttu dim'
              onClick={this.getStarted}
              >
              Get Started
            </div>
            <div
              className='mt3 underline pointer dim'
              onClick={this.skipGettingStarted}
            >
              Skip tour
              </div>
          </div>
          </div>
          <div className='w-20 bg-black-10 w-100'>
            placeholder
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
          this.props.closePopup()
          this.props.router.replace(`/${this.props.params.projectName}/models`)
        })
    }
  }

  private getStarted = (): void => {
    if (this.props.gettingStartedState.isCurrentStep('STEP1_OVERVIEW')) {
      this.props.closePopup()
      this.props.nextStep()
    }
  }

}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ nextStep, skip, closePopup }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OnboardingView))
