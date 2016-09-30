import * as React from 'react'
import * as Relay from 'react-relay'
import AuthProviderSidePanel from './AuthProviderSidePanel'
import Icon from '../../../components/Icon/Icon'
import {Project, AuthProviderType} from '../../../types/types'

interface Props {
  project: Project
}

interface State {
  selectedType: AuthProviderType
}

class AuthProviderPopup extends React.Component<Props, State> {

  state: State = {
    selectedType: 'AUTH_PROVIDER_EMAIL',
  }

  render() {
    const authProviders = this.props.project.authProviders.edges.map(edge => edge.node)
    return (
      <div className='flex justify-center items-center h-100 w-100 bg-white-50' style={{ pointerEvents: 'all' }}>
        <div className='bg-white br-2 flex flex-column shadow-2' style={{ minWidth: 800 }}>
          <div className='bg-accent flex justify-between items-center white pa4'>
            <div className='f3'>
              Authentication Methods
            </div>
            <div className='pointer dim'>
              <Icon
                src={require('assets/icons/close.svg')}
                width={40}
                height={40}
                color='white'
              />
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='flex flex-column br b--light-gray'>
              <div
                className='flex pa4 bb b--light-gray items-center dim pointer'
                onClick={() => this.setState({ selectedType: 'AUTH_PROVIDER_EMAIL' })}
              >
                <Icon
                  src={require('assets/icons/logo.svg')}
                  width={40}
                  height={40}
                />
                <div className='fw1 f4 mh3'>
                  Email/Pass
                </div>
                <div>
                {authProviders.find(x => x.type === 'AUTH_PROVIDER_EMAIL') &&
                  <Icon
                    src={require('assets/new_icons/check.svg')}
                  />
                }
                </div>
              </div>
              <div
                className='flex pa4 bb b--light-gray items-center dim pointer'
                onClick={() => this.setState({ selectedType: 'AUTH_PROVIDER_DIGITS' })}
              >
                <Icon
                  src={require('assets/icons/logo.svg')}
                  width={40}
                  height={40}
                />
                <div className='fw1 f4 mh3'>
                  Digits
                </div>
                <div>
                {authProviders.find(x => x.type === 'AUTH_PROVIDER_EMAIL') &&
                  <Icon
                    src={require('assets/new_icons/check.svg')}
                  />
                }
                </div>
              </div>
              <div
                className='flex pa4 bb b--light-gray items-center dim pointer'
                onClick={() => this.setState({ selectedType: 'AUTH_PROVIDER_AUTH0' })}
              >
                <Icon
                  src={require('assets/icons/logo.svg')}
                  width={40}
                  height={40}
                />
                <div className='fw1 f4 mh3'>
                  Auth0
                </div>
                <div>
                {authProviders.find(x => x.type === 'AUTH_PROVIDER_EMAIL') &&
                  <Icon
                    src={require('assets/new_icons/check.svg')}
                  />
                }
                </div>
              </div>
            </div>
            <AuthProviderSidePanel authProviders={authProviders} selectedType={this.state.selectedType} />
          </div>
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(AuthProviderPopup, {
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
