import * as React from 'react'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {nextStep} from '../../../actions/gettingStarted'
import {closePopup} from '../../../actions/popup'
import {classnames} from '../../../utils/classnames'
import Loading from '../../Loading/Loading'
const classes: any = require('./PlaygroundCPopup.scss')

type Examples = 'ReactRelay' | 'ReactApollo' | 'AngularApollo' | null

interface Guide {
  title: string
  description: string
  image: string
  route: string
}

/* tslint:disable */
const guides: Guide[] = [{
  title: 'Setting up a GraphQL backend in 5 minutes',
  description: 'In this guide you will learn how to setup the GraphQL backend for an Instagram clone in less than 5 minutes - without writing any server code. At the end of this guide you will have a good understanding of how to configure a GraphQL server and query it from your application.',
  route: 'setting-up-a-graphql-backend-in-5-minutes',
  image: require('../../../assets/graphics/building-instagram-in-5-minutes-preview.png'),
}, {
  title: 'Implementing Business Logic using Actions',
  description: 'Work in progress.',
  route: 'implementing-business-logic-using-actions',
  image: require('../../../assets/graphics/implementing-business-logic-using-actions-preview.png'),
}, {
  title: 'Thinking in terms of graphs',
  description: 'In this guide we will explore how thinking in graphs can help you structuring your data. The concept of graphs helps a lot with building a mental model of the data schema used in your application.',
  route: 'thinking-in-terms-of-graphs',
  image: require('../../../assets/graphics/thinking-in-terms-of-graphs-preview.png'),
}]
/* tslint:enable */

const examples = {
  ReactRelay: {
    path: 'react-relay-instagram-example',
    description: 'React + Relay',
  },
  ReactApollo: {
    path: 'react-apollo-instagram-example',
    description: 'React + Apollo',
  },
  AngularApollo: {
    path: 'angular-apollo-instagram-example',
    description: 'Angular + Apollo',
  },
}

interface Props {
  id: string
  projectId: string
  nextStep: () => Promise<void>
  closePopup: (id: string) => void
  params: any
  router: any
}

interface State {
  hovering: boolean
  mouseOver: boolean
  selectedExample: Examples
}

class PlaygroundBPopup extends React.Component<Props, State> {

  state = {
    hovering: false,
    mouseOver: false,
    selectedExample: null,
  }

  render() {
    const {hovering, mouseOver} = this.state
    const downloadUrl = (example) => `${__BACKEND_ADDR__}/resources/getting-started-example?repository=${examples[example].path}&project_id=${this.props.projectId}` // tslint:disable-line
    return (
      <div
        className='flex justify-center items-start w-100 h-100'
        style={{
          transition: 'background-color 0.3s ease',
          backgroundColor: hovering ? 'rgba(255,255,255,0.5)' : 'transparent',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          className='flex justify-center w-100'
          style={{
            transition: 'height 0.5s ease',
            height: hovering ? '100%' : mouseOver ? '190%' : '210%',
            pointerEvents: hovering ? 'all' : 'none',
            cursor: hovering ? 'auto' : 'pointer',
            overflow: hovering ? 'auto' : 'hidden',
            alignItems: this.state.selectedExample ? 'flex-start' : 'center',
          }}
          onClick={() => hovering && !this.state.selectedExample ? this.setState({hovering: false} as State) : null}
        >
          <div
            className='bg-white br-2 shadow-2 mv-96'
            style={{
              minWidth: 600,
              maxWidth: 900,
              pointerEvents: 'all',
            }}
            onMouseLeave={() => this.setState({ mouseOver: false } as State)}
            onMouseEnter={() => this.setState({ mouseOver: true } as State)}
            onClick={(e: any) => {
              e.stopPropagation()
              e.preventDefault()
              this.setState({ hovering: true } as State)
            }}
          >
            <div className='ma-16 tc pb-25'>
              <div className='fw3 ma-38 f-38'>
                You did it! Time to put our backend to work
              </div>
              <div className='fw2 f-16 mh-96 lh-1-4'>
                You have successfully set up your own Instagram backend.{' '}
                When building an app with Graphcool you can easily query in the{' '}
                playground and “copy &amp; paste” the result into your code.{' '}
                Of course, to do so, you need to implement the backend first.
              </div>
              <div className='fw2 f-16 mh-96 lh-1-4 mt-16'>
                <div>We put together a simple app to show and add posts</div>
                <div>using the backend you just build, to test and run it locally.</div>
              </div>
            </div>
            <div className='ma-16 tc pb-25'>
              <div className='fw3 ma-38 f-25'>
                Select your preferred technology to download the example.
              </div>
              <div className='flex justify-between items-center w-100'>
                <div
                  className={classnames(
                    classes.exampleButton,
                    this.state.selectedExample === 'ReactRelay' ? classes.active : ''
                  )}
                  onClick={() => this.setState({selectedExample: 'ReactRelay'} as State)}
                >
                  React + Relay
                </div>
                <div
                  className={classnames(
                    classes.exampleButton,
                    this.state.selectedExample === 'ReactApollo' ? classes.active : ''
                  )}
                  onClick={() => this.setState({selectedExample: 'ReactApollo'} as State)}
                >
                  React + Apollo
                </div>
                <div
                  className={classnames(
                    classes.exampleButton,
                    this.state.selectedExample === 'AngularApollo' ? classes.active : ''
                  )}
                  onClick={() => this.setState({selectedExample: 'AngularApollo'} as State)}
                >
                  Angular + Apollo
                </div>
              </div>
            </div>
          {this.state.selectedExample &&
          <div>
            <div className='w-100'>
              <iframe
                className='w-100'
                height='480'
                allowFullScreen
                frameBorder='0'
                src={`https://www.youtube.com/embed/${this.getExampleVideoUrl(this.state.selectedExample)}`}
              />
            </div>
            <div
              className='w-100 pa-25'
              style={{
                backgroundColor: '#FEF5D2',
              }}
            >
              <div className='mt-25 mb-38 w-100 flex justify-center'>
                <a
                  href={downloadUrl(this.state.selectedExample)}
                  className='pa-16 white'
                  style={{
                    backgroundColor: '#4A90E2',
                  }}
                >
                  Download example
                </a>
              </div>
              <div className='code dark-gray'>
                <div>
                  # To see the example in action, run the following commands:
                </div>
                <div className='mv-16'>
                  <div className='black'>
                    npm install
                  </div>
                  <div className='black'>
                    npm start
                  </div>
                </div>
                <div>
                  # The app opens automatically at localhost:3000. See the magic happen :)
                </div>
                <div>
                  # You might wanna come back to this page as soon as it’s done, we’re waiting here.
                </div>
              </div>
              <div className='w-100 mv-96 flex justify-center'>
                <Loading />
              </div>
            </div>
          </div>
          }
          {true &&
          <div className='w-100 mb-96'>
            <div className='flex items-center flex-column mv-38 fw1'>
              <div className='f-96'>
                🎉
              </div>
              <div className='f-38 mt-38'>
                Congratulations!
              </div>
              <div className='f-38 mt-16'>
                We knew you had it in you.
              </div>
              <div className='f-16 mv-38'>
                Now go out there and build amazing things!
              </div>
            </div>
            <div className='flex justify-between pa-16'>
              <div className='w-50 pr-16'>
                <div className='ttu f-25 fw1'>
                  Get started with on your own with those excellent guides
                </div>
                <div className='mv-38'>
                  {guides.map(guide => this.renderBox(guide))}
                </div>
              </div>
              <div className='w-50 pl-16'>
                <div className='ttu f-25 fw1'>
                  Get more out of Graphcool with our tutorials
                </div>
                <div className={`h-100 justify-start flex flex-column pv4 pv0-l pl3-l mv-38 ${classes.guides}`}>
                  <div className={classes.one}>
                    Setting up a GraphQL backend
                  </div>
                  <div className={classes.two}>
                    Implementing Business Logic
                  </div>
                  <div className={classes.three}>
                    Thinking in terms of graphs
                  </div>
                </div>
              </div>
            </div>
          </div>
          }
          </div>
        </div>
      </div>
    )
  }

  private renderBox = (guide: Guide) => {
    return (
      <a href={`/guides/${guide.route}`} key={guide.title}>
        <div className='flex pa-16 mb-38' style={{background: 'rgba(0,0,0,0.03)'}}>
          <div
            style={{
              minWidth: 75,
              height: 75,
              backgroundImage: `url(${guide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className='flex flex-column space-between ml-38'>
            <div className='mb-25 dark-gray' style={{fontSize: 24}}>
              {guide.title}
            </div>
            <div className='fw1 mid-gray' style={{fontSize: 16}}>
              {guide.description}
            </div>
          </div>
        </div>
      </a>
    )
  }

  private getExampleVideoUrl = (example: Examples): string => {
    switch (example) {
      case 'ReactRelay': return 'RDrfE9I8_hs'
      case 'ReactApollo': return 'RDrfE9I8_hs'
      case 'AngularApollo': return 'RDrfE9I8_hs'
      default: return 'RDrfE9I8_hs'
    }
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({nextStep, closePopup}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlaygroundBPopup))
