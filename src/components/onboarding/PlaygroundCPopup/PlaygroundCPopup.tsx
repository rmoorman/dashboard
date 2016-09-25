import * as React from 'react'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {nextStep} from '../../../actions/gettingStarted'
import {closePopup} from '../../../actions/popup'
import {classnames} from '../../../utils/classnames'
const classes: any = require('./PlaygroundCPopup.scss')

type Examples = 'ReactRelay' | 'ReactApollo' | 'AngularApollo' | null

interface Props {
  id: string
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
    return (
      <div
        className='flex justify-center items-start w-100 h-100'
        style={{
          transition: 'background-color 0.3s ease',
          backgroundColor: hovering ? 'rgba(255,255,255,0.5)' : 'transparent',
          pointerEvents: 'none',
          overflow: hovering ? 'auto' : 'hidden',
        }}
      >
        <div
          className='flex justify-center items-center w-100'
          style={{
            transition: 'height 0.5s ease',
            height: hovering ? '100%' : mouseOver ? '190%' : '210%',
            pointerEvents: hovering ? 'all' : 'none',
            cursor: hovering ? 'auto' : 'pointer',
          }}
          onClick={() => hovering ? this.setState({hovering: false} as State) : null}
        >
          <div
            className='bg-white br-2 shadow-2 mv-96'
            style={{
              minWidth: 600,
              maxWidth: 900,
              pointerEvents: 'all',
              transition: 'height 0.4s ease',
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
          </div>
          {this.state.selectedExample &&
          <div>
            <div>
            </div>
          </div>
          }
        </div>
      </div>
    )
  }

  private getExampleVideoUrl = (example: Examples): string => {
    switch (example) {
      case 'ReactRelay': return 'hello'
      case 'ReactApollo': return 'hell2'
      case 'AngularApollo': return 'hello2'
      default: return 'hello3'
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

