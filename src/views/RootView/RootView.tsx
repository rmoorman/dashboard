import * as React from 'react'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {clearNotification} from '../../actions/notification'
import {Notification} from '../../types/utils'
import NotificationSystem from 'react-notification-system'

interface Props {
  children: Element
  notification: Notification
  clearNotification: () => any
}

class RootView extends React.Component<Props, {}> {

  refs: {
    [key: string]: any;
    notificationSystem: any
  }

  componentWillUpdate(nextProps: Props) {
    if (nextProps.notification.level && nextProps.notification.message) {
      this.refs.notificationSystem.addNotification(nextProps.notification)
      this.props.clearNotification()
    }
  }

  render () {
    return (
      <div style={{ height: '100%' }}>
        <Helmet titleTemplate='%s | Graphcool'/>
        {this.props.children}
        <NotificationSystem ref='notificationSystem' />
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    notification: state.notification,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({clearNotification}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RootView)
