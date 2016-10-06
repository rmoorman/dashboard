import * as React from 'react'
import * as Relay from 'react-relay'
import * as Immutable from 'immutable'
import AddAuthProviderMutation from '../../../mutations/AddAuthProviderMutation'
import UpdateAuthProviderMutation from '../../../mutations/UpdateAuthProviderMutation'
import {connect} from 'react-redux'
import {onFailureShowNotification} from '../../../utils/relay'
import {showNotification} from '../../../actions/notification'
import {bindActionCreators} from 'redux'
import {Project, AuthProvider, AuthProviderType} from '../../../types/types'
import {ShowNotificationCallback} from '../../../types/utils'

function setIn(authProvider: AuthProvider, keyPath: string[], value: any): AuthProvider {
  return Immutable.fromJS(authProvider).setIn(keyPath, value).toJS()
}

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
}

class AuthProviderSidePanel extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      authProvider: Immutable.fromJS(this.getAuthProvider(props)),
    }
  }

  componentWillReceiveProps(props: Props) {
    this.setState({authProvider: Immutable.fromJS(this.getAuthProvider(props))})
  }

  render() {
    const {authProvider} = this.state
    const exists = authProvider.id !== ''
    const text = texts[this.props.selectedType]

    return (
      <div className='flex flex-column justify-between w-100'>
        <div className='flex flex-column'>
          <div
            className='w-100 white pa4 fw1'
            style={{
              backgroundColor: '#404040',
            }}
          >
            <div className='f-25 b'>
              {text.title}
            </div>
            <div className='f-16 mv3'>
              {text.description}
            </div>
            <div className='f-16'>
              <a href={text.link.href} className='white underline'>
                {text.link.content}
              </a>
            </div>
          </div>
          {authProvider.isEnabled &&
          <div
            className='flex w-100 justify-between white pa4'
            style={{
              backgroundColor: '#484848',
            }}
          >
            <div className='w-50 pr2 flex flex-column'>
              <div
                className='b mb3'
                style={{
                  color: '#A3A3A3',
                }}
              >
                Generated Fields
              </div>
              <div>
                <span
                  className='pa1 mb3 dib'
                  style={{
                    backgroundColor: '#636363',
                  }}
                >
                  digitsID
                </span>
              </div>
            </div>
            <div className='w-50 pl2 flex flex-column'>
              <div
                className='b mb3'
                style={{
                  color: '#A3A3A3',
                }}
              >
                Generated Mutations
              </div>
              <div>
                <span
                  className='pa1 mb3 dib'
                  style={{
                    backgroundColor: '#636363',
                  }}
                >
                  signInWithDigits
                </span>
              </div>
              <div>
                <span
                  className='pa1 mb3 dib'
                  style={{
                    backgroundColor: '#636363',
                  }}
                >
                  signInWithDigits
                </span>
              </div>
            </div>
          </div>
          }
          {authProvider.type === 'AUTH_PROVIDER_DIGITS' &&
          <div className='pa4 flex flex-column'>
            <input
              className='pa3 bg-light-gray br1 bn dark-gray mb2 f4'
              placeholder='Consumer Key'
              value={authProvider.digits!.consumerKey}
              onChange={(e: any) => this.setState({
                authProvider: setIn(this.state.authProvider, ['digits', 'consumerKey'], e.target.value),
              })}
            />
            <input
              className='pa3 bg-light-gray br1 bn dark-gray f4'
              placeholder='Consumer Secret'
              value={authProvider.digits!.consumerSecret}
              onChange={(e: any) => this.setState({
                authProvider: setIn(this.state.authProvider, ['digits', 'consumerSecret'], e.target.value),
              })}
            />
          </div>
          }
          {authProvider.type === 'AUTH_PROVIDER_AUTH0' &&
          <div className='pa4 flex flex-column'>
            <input
              className='pa3 bg-light-gray br1 bn dark-gray mb2 f4'
              placeholder='Domain'
              value={authProvider.auth0!.domain}
              onChange={(e: any) => this.setState({
                authProvider: setIn(this.state.authProvider, ['auth0', 'domain'], e.target.value),
              })}
            />
            <input
              className='pa3 bg-light-gray br1 bn dark-gray mb2 f4'
              placeholder='Client Id'
              value={authProvider.auth0!.clientId}
              onChange={(e: any) => this.setState({
                authProvider: setIn(this.state.authProvider, ['auth0', 'clientId'], e.target.value),
              })}
            />
            <input
              className='pa3 bg-light-gray br1 bn dark-gray mb2 f4'
              placeholder='Client Secret'
              value={authProvider.auth0!.clientSecret}
              onChange={(e: any) => this.setState({
                authProvider: setIn(this.state.authProvider, ['auth0', 'clientSecret'], e.target.value),
              })}
            />
          </div>
          }
        </div>
        <div className='flex justify-between pa3 bt b--light-gray'>
          {exists &&
          <div className='flex items-center'>
            <div
              className='ph4 pv3 f4 white pointer dim'
              style={{
                backgroundColor: '#F5A623',
              }}
            >
              Disable
            </div>
            <div className='ph4 pv3 f4 red pointer dim'>
              Remove
            </div>
          </div>
          }
          <div className='flex items-center'>
            {exists &&
            <div className='ph4 pv3 f4 dark-gray pointer dim'>
              Reset
            </div>
            }
            {!exists &&
            <div className='ph4 pv3 f4 white bg-accent pointer dim' onClick={this.enable}>
              Enable
            </div>
            }
          </div>
        </div>
      </div>
    )
  }

  private getAuthProvider(props: Props): AuthProvider {
    const authProviders = props.project.authProviders.edges.map(e => e.node)

    switch (props.selectedType) {
      case 'AUTH_PROVIDER_EMAIL':
        return authProviders.find(a => a.type === 'AUTH_PROVIDER_EMAIL') || {
            id: '',
            type: 'AUTH_PROVIDER_EMAIL',
            isEnabled: false,
            digits: null,
            auth0: null,
          }
      case 'AUTH_PROVIDER_DIGITS':
        return authProviders.find(a => a.type === 'AUTH_PROVIDER_DIGITS') || {
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
        return authProviders.find(a => a.type === 'AUTH_PROVIDER_AUTH0') || {
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
