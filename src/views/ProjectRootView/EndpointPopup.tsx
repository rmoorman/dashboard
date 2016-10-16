import * as React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {ReduxAction} from '../../types/reducers'
import {closePopup} from '../../actions/popup'

interface Props {
  id: string
  closePopup: (id: string) => ReduxAction
}

interface State {
}

class EndpointPopup extends React.Component<Props, State> {

  render() {
    return (
      <div className='flex bg-black-50 w-100 h-100 justify-center items-center'>
        <div className='pa2 bg-white' style={{pointerEvents: 'all'}}>
          List endpoints
          <div onClick={() => this.props.closePopup(this.props.id)}>Close</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({closePopup}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EndpointPopup)

