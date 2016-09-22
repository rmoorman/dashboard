import * as React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {closePopup} from '../../actions/popup'

class HoverPopup extends React.Component<{}, {}> {
  render() {
    return (
      <div className='flex justify-center items-center w-100 h-100'>
        <div className='' style={{bottom: '0'}}>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({closePopup}, dispatch)
}

export default connect(null, mapDispatchToProps)(HoverPopup)