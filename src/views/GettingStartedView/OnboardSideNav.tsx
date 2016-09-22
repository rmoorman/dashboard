import * as React from 'react'
import {connect} from 'react-redux'

class OnboardSideNav extends React.Component<{}, {}> {

  render() {
    return (
      <div className='flex flex-column justify-between h-100'>
        <div className='flex flex-column'>
          <div>
            Progress placeholder
          </div>
          <div>
            Items placeholder
          </div>
        </div>
        <div>
          As things are shaping up block box
        </div>
      </div>
    )
  }
}

export default connect()(OnboardSideNav)
