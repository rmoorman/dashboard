import * as React from 'react'
import * as Relay from 'react-relay'
import AuthProviderSidePanel from './AuthProviderSidePanel'
import Icon from '../../../components/Icon/Icon'
import {Project, AuthProviderType} from '../../../types/types'

interface Props {
  project: Project
  close: () => void
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
        <div className='bg-white br-2 shadow-2' style={{ width: 900 }}>
          <div className='bg-accent flex justify-between items-center white pa4'>
            <div className='f-38 fw1'>
              Authentication Methods
            </div>
            <div className='pointer' onClick={this.props.close}>
              <Icon
                src={require('assets/icons/close.svg')}
                width={40}
                height={40}
                color='white'
              />
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='flex flex-column br b--black-10' style={{ flex: '0 0 270px' }}>
              <div
                className={`
                flex pa4 bb b--black-10 items-center pointer justify-between
                ${this.state.selectedType === 'AUTH_PROVIDER_EMAIL' ? 'bg-black-05' : ''}
                `}
                onClick={() => this.setState({ selectedType: 'AUTH_PROVIDER_EMAIL' })}
              >
                <div className='flex items-center'>
                  <Icon
                    src={require('assets/icons/logo.svg')}
                    width={40}
                    height={40}
                    color='#00B861'
                  />
                  <div className='fw1 f-25 ml-16'>
                    Email
                  </div>
                </div>
                <div>
                  {authProviders.find(a => a.type === 'AUTH_PROVIDER_EMAIL' && a.isEnabled) &&
                  <Icon
                    src={require('assets/new_icons/check.svg')}
                    color='#7ED321'
                  />
                  }
                </div>
              </div>
              <div
                className={`
                flex pa4 bb b--black-10 items-center pointer justify-between
                ${this.state.selectedType === 'AUTH_PROVIDER_DIGITS' ? 'bg-black-05' : ''}
                `}
                onClick={() => this.setState({ selectedType: 'AUTH_PROVIDER_DIGITS' })}
              >
                <img src={require('assets/graphics/digits.png')}/>
                <div>
                  {authProviders.find(a => a.type === 'AUTH_PROVIDER_DIGITS' && a.isEnabled) &&
                  <Icon
                    src={require('assets/new_icons/check.svg')}
                    color='#7ED321'
                  />
                  }
                </div>
              </div>
              <div
                className={`
                flex pa4 bb b--black-10 items-center pointer justify-between
                ${this.state.selectedType === 'AUTH_PROVIDER_AUTH0' ? 'bg-black-05' : ''}
                `}
                onClick={() => this.setState({ selectedType: 'AUTH_PROVIDER_AUTH0' })}
              >
                <img src={require('assets/graphics/auth0.png')}/>
                <div>
                  {authProviders.find(a => a.type === 'AUTH_PROVIDER_AUTH0' && a.isEnabled) &&
                  <Icon
                    src={require('assets/new_icons/check.svg')}
                    color='#7ED321'
                  />
                  }
                </div>
              </div>
            </div>
            <AuthProviderSidePanel
              project={this.props.project}
              selectedType={this.state.selectedType}
            />
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
              type
              isEnabled
            }
          }
        }
        ${AuthProviderSidePanel.getFragment('project')}
      }
    `,
  },
})
