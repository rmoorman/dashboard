import * as React from 'react'
import {closePopup} from '../../actions/popup'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {classnames} from '../../utils/classnames'

const classes = require('./TemporaryNotification.scss')

interface Props {
  children: Element | string
  id: string
  closePopup: (id: string) => any
}

class TemporaryNotification extends React.Component<Props, {}> {

  componentDidMount() {
    setTimeout(
      () => this.props.closePopup(this.props.id),
      3000
    )
  }

  render() {
    return (
      <div className='flex w-100 h-100 justify-center items-center'>
        <div className={classnames('flex flex-column h-100', classes.fadeOut)}>
          <div className='h-50 w-100'>
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ closePopup }, dispatch)
}

export default connect(null, mapDispatchToProps)(TemporaryNotification)
