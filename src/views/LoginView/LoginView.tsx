import * as React from 'react'
import * as Relay from 'react-relay'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Loading from '../../components/Loading/Loading'
import {updateNetworkLayer, onFailureShowNotification} from '../../utils/relay'
import * as cookiestore from 'cookiestore'
import LoginMutation from '../../mutations/LoginMutation'
import Icon from '../../components/Icon/Icon'
import {Viewer} from '../../types/types'
import {showNotification} from '../../actions/notification'
import {ShowNotificationCallback} from '../../types/utils'
import {Transaction} from 'react-relay'
const classes: any = require('./LoginView.scss')

interface Props {
  viewer: Viewer
  showNotification: ShowNotificationCallback
}

interface State {
  loading: boolean
  email: string
  password: string
}

class LoginView extends React.Component<Props, State> {

  state = {
    loading: false,
    email: '',
    password: '',
  }

  componentDidMount () {
    analytics.track('login: viewed')
  }

  render () {
    if (this.state.loading) {
      return (
        <div className={classes.root}>
          <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Loading color='#fff' />
          </div>
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <div className={classes.box}>
          <div className={classes.logo}>
            <Icon
              width={60} height={70}
              src={require('assets/icons/logo.svg')}
              color='#fff'
              />
          </div>
          <div className={classes.form}>
            <input
              autoFocus
              ref='email'
              type='text'
              placeholder='Email'
              onChange={(e: any) => this.setState({ email: e.target.value } as State)}
              onKeyUp={this.listenForEnter}
              />
            <input
              ref='password'
              type='password'
              placeholder='Password'
              onChange={(e: any) => this.setState({ password: e.target.value } as State)}
              onKeyUp={this.listenForEnter}
              />
            <button onClick={this.login}>Login</button>
          </div>
        </div>
      </div>
    )
  }

  private login = () => {
    this.setState({ loading: true } as State)

    const { email, password } = this.state

    const payload = { email, password, viewer: this.props.viewer }
    const onSuccess = (response) => {
      cookiestore.set('graphcool_auth_token', response.signinCustomer.token)
      cookiestore.set('graphcool_customer_id', response.signinCustomer.viewer.user.id)
      updateNetworkLayer()

      analytics.track('login: logged in', () => {
        window.location.pathname = '/'
      })
    }
    const onFailure = (transaction: Transaction) => {
      onFailureShowNotification(transaction, this.props.showNotification)
      this.setState({ loading: false } as State)

      analytics.track('login: login failed', { email })
    }
    Relay.Store.commitUpdate(new LoginMutation(payload), {
      onSuccess,
      onFailure,
    })
  }

  private listenForEnter = (e: any) => {
    if (e.keyCode === 13) {
      this.login()
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({showNotification}, dispatch)
}

const MappedLoginView = connect(null, mapDispatchToProps)(LoginView)

export default Relay.createContainer(MappedLoginView, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
      }
    `,
  },
})
