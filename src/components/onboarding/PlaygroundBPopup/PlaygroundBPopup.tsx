import * as React from 'react'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {nextStep} from '../../../actions/gettingStarted'
import {closePopup} from '../../../actions/popup'
import Icon from '../../Icon/Icon'

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
}

class PlaygroundBPopup extends React.Component<Props, State> {

  state = {
    hovering: false,
    mouseOver: false,
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
                Nice one! Now let’s try something harder:
            </div>
              <div className='fw2 f-16 mh-96 lh-1-4'>
                Since we have created an Instagram clone, let’s fetch the two posts that contain our #coolgraph hashtag.
            </div>
            </div>

            <div className='tc bg-gray-06'>
              <div className='fw4 ls-2 pt-25 pb-38 accent'>
                HERE'S YOUR SECOND TASK
            </div>
              <div className='flex justify-center items-center'>
                <div className='mw6 bg-accent br-2 tl shadow-2'>
                  <div className='w-100 pa-16 white fw8' style={{ backgroundColor: '#00A854' }}>
                    Query only the posts that contain the #coolgraph hashtag
                </div>
                  <div className='w-100 pa-16 black-50 lh-1-4'>
                    To do so, use our built-in filters. To find out, how to use them, look in the docs section.
                </div>
                </div>
              </div>

              <div className='flex justify-center items-center'>
                <div
                  className='pa-16 fw5 bg-black-05 mt-25 mb-38 ls-1 blue br-2 flex items-center pointer'
                  onClick={this.next}
                  >
                  TRY IT OUT&nbsp;
                <Icon src={require('../../../assets/new_icons/arrow-right.svg')} width={29} height={15} />
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    )
  }

  private next = (): void => {
    this.props.nextStep().then(() => {
      this.props.router.push(`/${this.props.params.projectName}/playground`)
      this.props.closePopup(this.props.id)
    })
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
