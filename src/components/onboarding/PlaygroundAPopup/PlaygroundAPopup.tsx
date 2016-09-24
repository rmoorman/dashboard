import * as React from 'react'
import {Link} from 'react-router'

interface Props {
}

export default class PlaygroundAPopup extends React.Component<Props, {}> {

  render() {
    return (
      <div className='flex justify-center items-center h-90 w-100 bg-white-50' style={{pointerEvents: 'all'}}>
        <div className='bg-white br-2 shadow-2 pa-16 db' style={{ minWidth: 1000, maxWidth: 1200 }}>

          <div className='bb bc-grey-2 tc pb-25'>
            <h4 className='fw2 tracked-mega mv-60'>OUR PLAYGROUND</h4>
            <h1 className='fw3 ma-38 f-38'>An interactive powerful GraphQL editor</h1>

            <p className='fw2 f-16 mh-96 db'>GraphQL makes it intuitive and fun to play around with your API. The easiest
            way to do that is using the "Playground" which comes with helpful features.</p>
            <Link to={'#'} className='db ma-25 accent underline'>Don't know GraphQL?</Link>
          </div>

          <div className='bb bc-grey-2 tc pb-25'>
            <h4 className='fw2 tracked-mega gray-50'>HOW IT BASICALLY WORKS</h4>
            <br/><br/><br/><br/><br/><br/>
            <p className='fw2 f-16 mh-96 db'>Enter your query in the left pane. Hit the &#9658; button and get the result in the right pane.</p>
          </div>

          <div className='tc pb-25'>
            <h4 className='fw2 tracked-mega gray-50'>HELPFUL FEATURES</h4>
            <br/><br/><br/><br/><br/><br/>
            <p className='fw2 f-16 mh-96 db'>Press CTRL + SPACE to trigger auto completion.</p>
            <p className='fw2 f-16 mh-96 db'>Hit Docs to get an complete overview of what you can do with your API.</p>
          </div>

          <div className='tc pb-25 bg-gray-06'>
            <h4 className='fw2 tracked-mega accent'>SO HERE'S YOUR FIRST TASK:</h4>
            <br/><br/><br/><br/><br/><br/>
            <p className='fw2 f-16 mh-96 db'>Press CTRL + SPACE to trigger auto completion.</p>
            <p className='fw2 f-16 mh-96 db'>Hit Docs to get an complete overview of what you can do with your API.</p>
          </div>

        </div>
      </div>
    )
  }
}
