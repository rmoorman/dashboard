import * as React from 'react'
import * as Relay from 'react-relay'
import * as Immutable from 'immutable'
import FloatingInput from '../../../components/FloatingInput/FloatingInput'
import AddAuthProviderMutation from '../../../mutations/AddAuthProviderMutation'
import UpdateAuthProviderMutation from '../../../mutations/UpdateAuthProviderMutation'
import DisableAuthProviderMutation from '../../../mutations/DisableAuthProviderMutation'
import {connect} from 'react-redux'
import {onFailureShowNotification} from '../../../utils/relay'
import {showNotification} from '../../../actions/notification'
import {bindActionCreators} from 'redux'
import {Project, AuthProvider, AuthProviderType} from '../../../types/types'
import {ShowNotificationCallback} from '../../../types/utils'

interface AuthText {
  title: string
  description: string
  link: {
    href: string
    content: string
  }
}

const texts: {[key: string]: AuthText} = {
  AUTH_PROVIDER_EMAIL: {
    title: 'Graphcool Email + Password',
    description: 'Use our built-in auth system that authenticates users with email and password',
    link: {
      href: 'https://docs.graph.cool/reference/platform#temporary-authentication-token',
      content: 'docs.graph.cool',
    },
  },
  AUTH_PROVIDER_DIGITS: {
    title: 'Digits - Two-Step Phone Authentication',
    description: 'Digits offers two-step authentification via a phone number and a code that is send to respective number.', // tslint:disable-line
    link: {
      href: 'www.digits.com',
      content: 'www.digits.com',
    },
  },
  AUTH_PROVIDER_AUTH0: {
    title: 'Auth0 – Broad Authentication Solution',
    description: 'Auth0 combines a variety of authentification methods and a dashboard to organize them.',
    link: {
      href: 'www.auth0.com',
      content: 'www.auth0.com',
    },
  },
}

interface Props {
  selectedType: AuthProviderType
  project: Project
  showNotification: ShowNotificationCallback
}

interface State {
  authProvider: AuthProvider
  hasChanged: boolean
}

class AuthProviderSidePanel extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      authProvider: this.getAuthProvider(props),
      hasChanged: false,
    }
  }

  componentWillReceiveProps(props: Props) {
    this.setState({
      authProvider: this.getAuthProvider(props),
      hasChanged: false,
    })
  }

  render() {
    const {authProvider} = this.state
    const exists = authProvider.id !== ''
    const text = texts[this.props.selectedType]

    return (
      <div className='flex flex-column justify-between w-100'>
        <div className='flex flex-column'>
          <div className='w-100 white pa-38 fw1 bg-black-80 relative'>
            {authProvider.isEnabled &&
              <div
                className='absolute pa-6 bg-accent white ttu br-1 fw5'
                style={{ top: 16, right: 16, background: '#7ED321', fontSize: 14 }}
              >
                Active
              </div>
            }
            <div className='f-25 b'>
              {text.title}
            </div>
            <div className='f-16 mv-16'>
              {text.description}
            </div>
            <div className='f-16'>
              <a href={text.link.href} className='white underline'>
                {text.link.content}
              </a>
            </div>
          </div>
          {authProvider.type === 'AUTH_PROVIDER_EMAIL' &&
          <div className='flex w-100 bg-black-70 justify-between white pa-38'>
            <div className='w-30 pr2 flex flex-column'>
              <div className='b mb-16 white-50'>
                Generated Fields
              </div>
              <div>
                <span className='pa-6 mb-10 br-2 dib bg-white-10' style={{ fontSize: 13 }}>
                  email
                </span>
              </div>
              <div>
                <span className='pa-6 mb-10 br-2 dib bg-white-10' style={{ fontSize: 13 }}>
                  password
                </span>
              </div>
            </div>
            <div className='w-70 flex flex-column'>
              <div className='b mb-16 white-50'>
                Generated Mutations
              </div>
              <div>
              <span className='pa-6 mb-10 br-2 dib bg-white-10' style={{ fontSize: 13 }}>
                {`createUser(authProvider: { email: { email, password } })`}
              </span>
              </div>
              <div>
              <span className='pa-6 mb-10 br-2 dib bg-white-10' style={{ fontSize: 13 }}>
                {`signinUser(digits: { email, password })`}
              </span>
              </div>
            </div>
          </div>
          }
          {authProvider.type === 'AUTH_PROVIDER_DIGITS' &&
          <div className='flex w-100 bg-black-70 justify-between white pa-38'>
            <div className='w-30 pr2 flex flex-column'>
              <div className='b mb-16 white-50'>
                Generated Fields
              </div>
              <div>
                <span className='pa-6 mb-10 br-2 dib bg-white-10' style={{ fontSize: 13 }}>
                  digitsID
                </span>
              </div>
            </div>
            <div className='w-70 flex flex-column'>
              <div className='b mb-16 white-50'>
                Generated Mutations
              </div>
              <div>
                <span className='pa-6 mb-10 br-2 dib bg-white-10' style={{ fontSize: 13 }}>
                  {`createUser(authProvider: { digits: { apiUrl, credentials } })`}
                </span>
              </div>
              <div>
                <span className='pa-6 mb-10 br-2 dib bg-white-10' style={{ fontSize: 13 }}>
                  {`signinUser(digits: { apiUrl, credentials })`}
                </span>
              </div>
            </div>
          </div>
          }
          {authProvider.type === 'AUTH_PROVIDER_DIGITS' &&
          <div className='pa-38 flex flex-column fw1'>
            <FloatingInput
              labelClassName='f-25 pa-16 black-50'
              className='pa-16 bg-black-05 br-2 bn mb-10 f-25'
              label='Consumer Key'
              placeholder='xxxxxxxxxxxxx'
              value={authProvider.digits!.consumerKey}
              onChange={(e: any) => this.setIn(['digits', 'consumerKey'], e.target.value)}
              onKeyDown={e => e.keyCode === 13 && this.enable()}
            />
            <FloatingInput
              labelClassName='f-25 pa-16 black-50'
              className='pa-16 bg-black-05 br-2 bn f-25'
              label='Consumer Secret'
              placeholder='xxxxxxxxxxxxx'
              value={authProvider.digits!.consumerSecret}
              onChange={(e: any) => this.setIn(['digits', 'consumerSecret'], e.target.value)}
              onKeyDown={e => e.keyCode === 13 && this.enable()}
            />
          </div>
          }
          {authProvider.type === 'AUTH_PROVIDER_AUTH0' &&
          <div className='flex w-100 bg-black-70 justify-between white pa-38'>
            <div className='w-30 pr2 flex flex-column'>
              <div className='b mb-16 white-50'>
                Generated Fields
              </div>
              <div>
                <span className='pa-6 mb-10 br-2 dib bg-white-10' style={{ fontSize: 13 }}>
                  auth0UserId
                </span>
              </div>
            </div>
            <div className='w-70 flex flex-column'>
              <div className='b mb-16 white-50'>
                Generated Mutations
              </div>
              <div>
                <span className='pa-6 mb-10 br-2 dib bg-white-10' style={{ fontSize: 13 }}>
                  {`createUser(authProvider: { auth0: { idToken } })`}
                </span>
              </div>
              <div>
                <span className='pa-6 mb-10 br-2 dib bg-white-10' style={{ fontSize: 13 }}>
                  {`signinUser(auth0: { idToken })`}
                </span>
              </div>
            </div>
          </div>
          }
          {authProvider.type === 'AUTH_PROVIDER_AUTH0' &&
          <div className='pa-38 flex flex-column'>
            <FloatingInput
              labelClassName='f-25 pa-16 black-50'
              className='pa-16 bg-black-05 br-2 bn mb-10 f-25'
              label='Domain'
              placeholder='xxxxxxxxxxxxx'
              value={authProvider.auth0!.domain}
              onChange={(e: any) => this.setIn(['auth0', 'domain'], e.target.value)}
              onKeyDown={e => e.keyCode === 13 && this.enable()}
            />
            <FloatingInput
              labelClassName='f-25 pa-16 black-50'
              className='pa-16 bg-black-05 br-2 bn mb-10 f-25'
              label='Client Id'
              placeholder='xxxxxxxxxxxxx'
              value={authProvider.auth0!.clientId}
              onChange={(e: any) => this.setIn(['auth0', 'clientId'], e.target.value)}
              onKeyDown={e => e.keyCode === 13 && this.enable()}
            />
            <FloatingInput
              labelClassName='f-25 pa-16 black-50'
              className='pa-16 bg-black-05 br-2 bn mb-10 f-25'
              label='Client Secret'
              placeholder='xxxxxxxxxxxxx'
              value={authProvider.auth0!.clientSecret}
              onChange={(e: any) => this.setIn(['auth0', 'clientSecret'], e.target.value)}
              onKeyDown={e => e.keyCode === 13 && this.enable()}
            />
          </div>
          }
        </div>
        <div className='flex justify-between pa-25 bt b--light-gray'>
          {exists &&
          <div
            className='ph-25 pv-16 f-25 white pointer'
            style={{
              backgroundColor: '#F5A623',
            }}
            onClick={this.disable}
          >
            Disable
          </div>
          }
          {!exists &&
          <div className='ph-25 pv-16 f-25 white bg-accent pointer' onClick={this.enable}>
            Enable
          </div>
          }
          {exists && this.state.hasChanged &&
          <div className='ph-25 pv-16 f-25 white bg-accent pointer' onClick={this.enable}>
            Update
          </div>
          }
        </div>
      </div>
    )
  }

  private getEmptyAuthProvider(props: Props): AuthProvider {
    switch (props.selectedType) {
      case 'AUTH_PROVIDER_EMAIL':
        return {
          id: '',
          type: 'AUTH_PROVIDER_EMAIL',
          isEnabled: false,
          digits: null,
          auth0: null,
        }
      case 'AUTH_PROVIDER_DIGITS':
        return {
          id: '',
          type: 'AUTH_PROVIDER_DIGITS',
          isEnabled: false,
          digits: {
            consumerKey: '',
            consumerSecret: '',
          },
          auth0: null,
        }
      case 'AUTH_PROVIDER_AUTH0':
        return {
          id: '',
          type: 'AUTH_PROVIDER_AUTH0',
          isEnabled: false,
          digits: null,
          auth0: {
            domain: '',
            clientId: '',
            clientSecret: '',
          },
        }
    }
  }

  private setIn = (keyPath: string[], value: any): void => {
    this.setState({
      authProvider: Immutable.fromJS(this.state.authProvider).setIn(keyPath, value).toJS(),
      hasChanged: true,
    })
  }

  private getAuthProvider(props: Props): AuthProvider {
    const authProvider = props.project.authProviders.edges.map(e => e.node).find(a => a.type === props.selectedType)
    return authProvider || this.getEmptyAuthProvider(props)
  }

  private disable = () => {
    const {authProvider} = this.state
    Relay.Store.commitUpdate(
      new DisableAuthProviderMutation({
        authProviderId: authProvider.id,
        projectId: this.props.project.id,
        type: authProvider.type,
      }),
      {
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.props.showNotification)
        },
      }
    )
  }

  private enable = () => {
    const {authProvider} = this.state
    if (authProvider.id === '') {
      Relay.Store.commitUpdate(
        new AddAuthProviderMutation({
          projectId: this.props.project.id,
          type: authProvider.type,
          digits: authProvider.digits,
          auth0: authProvider.auth0,
        }),
        {
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.props.showNotification)
          },
        }
      )
    } else {
      Relay.Store.commitUpdate(
        new UpdateAuthProviderMutation({
          authProviderId: authProvider.id,
          projectId: this.props.project.id,
          type: authProvider.type,
          digits: authProvider.digits,
          auth0: authProvider.auth0,
        }),
        {
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.props.showNotification)
          },
        }
      )
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({showNotification}, dispatch)
}

export default Relay.createContainer(connect(null, mapDispatchToProps)(AuthProviderSidePanel), {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        authProviders(first: 100) {
          edges {
            node {
              id
              type
              isEnabled
              digits {
                consumerKey
                consumerSecret
              }
              auth0 {
                clientId
                clientSecret
                domain
              }
            }
          }
        }
      }
    `,
  },
})
