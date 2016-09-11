import * as React from 'react'
import { PropTypes } from 'react'
import * as Relay from 'react-relay'
import mapProps from 'map-props'
import { Link } from 'react-router'
import { findDOMNode } from 'react-dom'
import Loading from '../../components/Loading/Loading'
import { Follow } from 'react-twitter-widgets'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { GettingStartedState, nextStep, skip } from '../../reducers/GettingStartedState'
import { Client } from '../../types/types'

const classes: any = require('./GettingStartedView.scss')

interface ScriptProps {
  url: string,
}

class Script extends React.Component<ScriptProps, {}> {
  static propTypes = {
    url: PropTypes.string.isRequired,
  }

  componentDidMount () {
    const element = findDOMNode((this.refs as any).element)
    const script = document.createElement('script')
    script.src = this.props.url
    script.async = true
    script.defer = true
    element.appendChild(script)
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <div ref='element' {...this.props} />
    )
  }
}

const examples = {
  REACT_RELAY: {
    path: 'react-relay-instagram-example',
    description: 'React + Relay',
  },
  REACT_APOLLO: {
    path: 'react-apollo-instagram-example',
    description: 'React + Apollo',
  },
  ANGULAR_APOLLO: {
    path: 'angular-apollo-instagram-example',
    description: 'Angular + Apollo',
  },
}

interface Example {
  path: string,
  description: string,
}

interface ViewProps {
  params: any,
  projectId: string,
  user: Client,
  gettingStartedState: GettingStartedState,
  nextStep: any,
  skip: any,
}

interface ViewState {
  selectedExample: Example
}

class GettingStartedView extends React.Component<ViewProps, ViewState> {
  static propTypes = {
    params: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    gettingStartedState: PropTypes.object.isRequired,
    nextStep: PropTypes.func.isRequired,
    skip: PropTypes.func.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  context: {
    router?: any
  }

  constructor (props: ViewProps) {
    super(props)
    this.state = {
      selectedExample: examples.REACT_RELAY,
    }
  }

  componentWillMount (): void {
    if (!this.props.gettingStartedState.isActive()) {
      this.context.router.replace(`/${this.props.params.projectName}/models`)
    }
  }

  componentDidMount (): void {
    analytics.track('getting-started: viewed', {
      project: this.props.params.projectName,
      step: this.props.gettingStartedState.step,
    })
  }

  componentDidUpdate (): void {
    if (this.props.gettingStartedState.progress === 4) {
      const snd = new Audio(require('assets/success.mp3') as string)
      snd.volume = 0.5
      snd.play()
    }
  }

  _getStarted (): void {
    if (this.props.gettingStartedState.isCurrentStep('STEP1_OVERVIEW')) {
      this.props.nextStep()
    }
  }

  _selectExample (example: Example): void {
    this.setState({selectedExample: example})
  }

  _skipGettingStarted (): void {
    if (window.confirm('Do you really want skip the getting started tour?')) {
      // TODO: fix this hack
      Promise.resolve(this.props.skip())
        .then(() => {
          this.context.router.replace(`/${this.props.params.projectName}/models`)
        })
    }
  }

  _onClose (): void {
    analytics.track('getting-started: closed')
  }

  _selectCommands (): void {
    const commands = findDOMNode((this.refs as any).commands)
    const range = document.createRange()
    range.setStartBefore(commands)
    range.setEndAfter(commands)
    window.getSelection().addRange(range)
  }

  render () {
    const { progress } = this.props.gettingStartedState
    const overlayActive = progress === 0 || progress === 4
    const firstName = this.props.user.name.split(' ')[0]
    const downloadUrl = (example) => `${__BACKEND_ADDR__}/resources/getting-started-example?repository=${example.path}&project_id=${this.props.projectId}` // tslint:disable-line

    return (
      <div className={classes.root}>
        {progress === 0 &&
          <div className={classes.overlay}>
            <div className={classes.emoji}>🙌</div>
            <div>
              <h2><strong>Hi {firstName}</strong>, welcome to our Dashboard.</h2>
              <p>
                To make your start a bit easier, we have prepared a little tour for you.
              </p>
              <p>
                It will take about 3 minutes and show you the basic features<br />
                by creating a GraphQL backend for an Instagram clone.
              </p>
            </div>
            <div className={classes.buttons}>
              <div
                className={`${classes.button} ${classes.green}`}
                style={{width: 260}}
                onClick={this._getStarted.bind(this)}
              >
                Let’s go
              </div>
              <div
                className={`${classes.button} ${classes.grey}`}
                style={{width: 170}}
                onClick={this._skipGettingStarted.bind(this)}
              >
                Skip tour
              </div>
            </div>
          </div>
        }
        {progress === 4 &&
          <div className={classes.overlay}>
            <div className={classes.emoji}>🎉</div>
            <div>
              <h2><strong>Congratulations</strong>, you did it!</h2>
              <p>
                We hope you like how easy it is to setup your own GraphQL backend.<br />
                If you need any help please join our Slack community. We’d love to talk to you!
              </p>
            </div>
            <div className={classes.social}>
              <div className={classes.twitter}>
                <Follow username='graphcool' />
              </div>
              <Script url='https://slack.graph.cool/slackin.js' />
            </div>
            <div className={classes.buttons}>
              <a
                href='https://docs.graph.cool/guides/setting-up-a-graphql-backend-in-5-minutes#2-defining-relations-between-your-models'
                target='_blank'
                onClick={() => analytics.track('getting-started: continue with next steps')}
                className={`${classes.button} ${classes.green}`}
                style={{width: 310}}
              >
                Continue with next steps
              </a>
              <Link
                to={`/${this.props.params.projectName}/models`}
                onClick={() => analytics.track('getting-started: closed')}
                className={`${classes.button} ${classes.grey}`}
                style={{width: 170}}
              >
                Close
              </Link>
            </div>
          </div>
        }
        {progress <= 1 &&
          <div className={`${classes.step} ${overlayActive ? classes.blurred : ''}`}>
            <div className={classes.text}>
              <h2>1. Create <strong>Post</strong> model</h2>
              <p>
                In this first step you will learn to create a new <i>model</i> called <strong>Post</strong>.
              </p>
              <p>
                A model is a collection of several fields defining the structure of your data.
              </p>
            </div>
            <div className={classes.image}>
              <img src={require('assets/graphics/getting-started-1.svg') as string} />
            </div>
          </div>
        }
        {progress === 2 &&
          <div className={`${classes.step} ${overlayActive ? classes.blurred : ''}`}>
            <div className={classes.text}>
              <h2>2. Add some data</h2>
              <p>
                In this step you will add some data to the <strong>Post</strong> model you just created.
                It doesn’t matter what you add, it’s just about populating the database.
              </p>
              <p>
                It’s also possible to import existing data.
              </p>
            </div>
            <div className={classes.image}>
              <img src={require('assets/graphics/getting-started-2.svg') as string} />
            </div>
          </div>
        }
        {progress >= 3 &&
          <div className={`${classes.step} ${overlayActive ? classes.blurred : ''}`}>
            <div className={classes.text}>
              <h2>3. Run example app</h2>
              <p>
                Awesome. You’re done setting up the backend.
              </p>
              <p>
                Now it’s time to test the backend from an actual app. Choose your own example below!
              </p>
            </div>
            <div className={classes.image}>
              <img src={require('assets/graphics/getting-started-3.svg') as string} />
            </div>
            <div className={classes.selection}>
              {Object.keys(examples).map((key) => (
                <div
                  key={key}
                  className={`
                    ${classes.selectExample}
                    ${this.state.selectedExample === examples[key] ? classes.selected : ''}`
                  }
                  onClick={() => this._selectExample(examples[key])}
                >
                  {examples[key].description}
                </div>
              ))}
            </div>
            <div className={classes.instructions}>
              <div className={classes.step1}>
                <h3>1. Download example app</h3>
                <a
                  href={downloadUrl(this.state.selectedExample)}
                  className={`${classes.download} ${classes.button} ${classes.green}`}
                >
                  Download example
                </a>
              </div>
              <div className={classes.step2}>
                <h3>
                  2. Run these commands
                </h3>
                <div
                  onClick={this._selectCommands.bind(this)}
                  className={classes.field}
                  ref='commands'
                >
                  npm install<br />npm start<br /><span className={classes.comment}># open localhost:3000</span>
                </div>
              </div>
              <div className={classes.step3}>
                <h3>
                  <a href='http://localhost:3000' target='_blank'>3. Open the example app</a>
                </h3>
                {progress === 3 &&
                  <div className={classes.status}>
                    <Loading color='#8989B1' />
                    &nbsp;&nbsp;Checking status...
                  </div>
                }
              </div>
            </div>
          </div>
        }
        <div className={classes.pagination}>
          <span className={progress <= 1 ? classes.active : ''} />
          <span className={progress === 2 ? classes.active : ''} />
          <span className={progress >= 3 ? classes.active : ''} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStartedState,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ nextStep, skip }, dispatch)
}

const ReduxContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(GettingStartedView)

const MappedGettingStartedView = mapProps({
  params: (props) => props.params,
  projectId: (props) => props.viewer.project.id,
  user: (props) => props.viewer.user,
})(ReduxContainer)

export default Relay.createContainer(MappedGettingStartedView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          id
        }
        user {
          id
          name
        }
      }
    `,
  },
})
