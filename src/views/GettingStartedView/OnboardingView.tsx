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
          <div>
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
            <div>
              <div
                style={{width: 260}}
                onClick={this.getStarted}
              >
                Let’s go
              </div>
              <div
                style={{width: 170}}
                onClick={this.skipGettingStarted}
              >
                Skip tour
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
