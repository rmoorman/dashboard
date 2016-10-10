import * as React from 'react'
import * as Relay from 'react-relay'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {nextStep} from '../../actions/gettingStarted'
import {Link} from 'react-router'
import ModelDescription from './ModelDescription'
import Tether from '../../components/Tether/Tether'
import Header from '../../components/Header/Header'
import {Model, Viewer, Project} from '../../types/types'
import {GettingStartedState} from '../../types/gettingStarted'
import PopupWrapper from '../../components/PopupWrapper/PopupWrapper'
import AuthProviderPopup from './AuthProviderPopup/AuthProviderPopup'
const classes: any = require('./ModelHeader.scss')

interface Props {
  children: Element
  params: any
  gettingStartedState: GettingStartedState
  model: Model
  nextStep: any
  viewer: Viewer
  project: Project
}

interface State {
  authProviderPopupVisible: boolean
}

class ModelHeader extends React.Component<Props, State> {

  state = {
    authProviderPopupVisible: false,
  }

  render() {
    const dataViewOnClick = () => {
      if (this.props.gettingStartedState.isCurrentStep('STEP3_CLICK_DATA_BROWSER')) {
        this.props.nextStep()
      }
    }

    return (
      <div className={classes.root}>
        {this.state.authProviderPopupVisible &&
        <PopupWrapper>
          <AuthProviderPopup
            project={this.props.project}
            close={() => this.setState({ authProviderPopupVisible: false } as State)}
          />
        </PopupWrapper>
        }
        <div className={classes.top}>
          <Header
            viewer={this.props.viewer}
            params={this.props.params}
            project={this.props.project}
          >
            <div className={classes.info}>
              <div className={classes.title}>
                {this.props.model.name}
                {this.props.model.isSystem &&
                <span className={classes.system}>System</span>
                }
                <span className={classes.itemCount}>{this.props.model.itemCount} items</span>
              </div>
              <div className={classes.titleDescription}>
                <ModelDescription model={this.props.model}/>
              </div>
            </div>
          </Header>
        </div>
        <div className={classes.bottom}>
          <div className={classes.tabs}>
            <Tether
              steps={[{
                step: 'STEP3_CLICK_DATA_BROWSER',
                title: 'Switch to the Data Browser',
                description: 'In the Data Browser you can view and manage your data ("Post" nodes in our case).', // tslint:disable-line
              }]}
              width={280}
              offsetX={-35}
              offsetY={5}
            >
              <Link
                to={`/${this.props.params.projectName}/models/${this.props.params.modelName}/browser`}
                className={classes.tab}
                activeClassName={classes.active}
                onClick={dataViewOnClick}
              >
                Data Browser
              </Link>
            </Tether>
            <Link
              to={`/${this.props.params.projectName}/models/${this.props.params.modelName}/structure`}
              className={classes.tab}
              activeClassName={classes.active}
            >
              Structure
            </Link>
            {this.props.model.name === 'User' &&
            <div
              className='pointer f-16 pa-25'
              onClick={() => this.setState({ authProviderPopupVisible: true } as State)}
            >
              Configure Auth Provider
            </div>
            }
          </div>
          <div className={classes.buttons}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({nextStep}, dispatch)
}

const ReduxContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModelHeader)

export default Relay.createContainer(ReduxContainer, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${Header.getFragment('viewer')}
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        ${Header.getFragment('project')}
        ${AuthProviderPopup.getFragment('project')}
      }
    `,
    model: () => Relay.QL`
      fragment on Model {
        id
        name
        itemCount
        isSystem
        ${ModelDescription.getFragment('model')}
      }
    `,
  },
})
