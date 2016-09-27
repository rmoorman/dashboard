import * as React from 'react'
import {withRouter} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {nextStep} from '../../../actions/gettingStarted'
import Icon from '../../Icon/Icon'

interface Props {
  id: string
  nextStep: () => Promise<void>
  params: any
  router: any
}

class PlaygroundAPopup extends React.Component<Props, {}> {

  render() {
    return (
      <div
        className='flex justify-center items-start w-100 bg-white-50 h-100 overflow-auto'
        style={{pointerEvents: 'all'}}
      >
        <div className='bg-white br-2 shadow-2 mv-60' style={{ minWidth: 600, maxWidth: 900 }}>

          <div className='ma-16 bb bc-grey-2 tc pb-25'>
            <div className='fw2 ls-2 mv-60'>OUR PLAYGROUND</div>
            <div className='fw3 ma-38 f-38'>An interactive powerful GraphQL editor</div>

            <div className='fw2 f-16 mh-96 lh-1-4'>
              GraphQL makes it intuitive and fun to play around with your API. The easiest
              way to do that is using our built-in "Playground" which comes with several helpful features.
            </div>
            <a href='https://learngraphql.com/' target='_blank' className='db ma-25 accent underline'>
              Don't know GraphQL?
            </a>
          </div>

          <div className='ma-16 bc-grey-2 tc'>
            <div className='fw2 ls-2 gray-50 mv-38'>HOW IT WORKS</div>
            <div>
              <img src={require('../../../assets/gifs/playground1.gif')} />
            </div>
            <div className='fw2 lh-1-4 f-16 mh-96 mv-25'>
              Enter your query in the left pane. Hit the &#9658; button and get the result in the right pane. <br />
              Press CTRL + SPACE for auto completion. Hit Docs to explore your API.
            </div>
          </div>

          <div className='tc bg-gray-06'>
            <div className='fw4 ls-2 pt-25 pb-38 accent'>
              HERE'S YOUR FIRST TASK:
            </div>
            <div className='flex justify-center items-center'>
              <div className='mw6 bg-accent br-2 tl shadow-2'>
                <div className='w-100 pa-16 white fw8' style={{backgroundColor: '#00A854'}}>
                  Query the imageUrl and hashtags of all posts
                </div>
                <div className='w-100 pa-16 black-50 lh-1-4'>
                  If you're stuck, try the auto completion or look into the docs to get an overview.
                  If that doesn't help, try the chat.
                </div>
              </div>
            </div>

            <div className='flex justify-center items-center'>
              <div
                className='pa-16 fw5 bg-black-05 mt-25 mb-38 ls-1 blue br-2 flex items-center pointer'
                onClick={this.next}
              >
                TRY IT OUT&nbsp;
                <Icon src={require('../../../assets/new_icons/arrow-right.svg')} width={29} height={15}/>
              </div>
            </div>

          </div>

        </div>
      </div>
    )
  }

  private next = (): void => {
    this.props.nextStep()
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlaygroundAPopup))
