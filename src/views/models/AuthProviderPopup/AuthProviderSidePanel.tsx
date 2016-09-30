import * as React from 'react'
import {AuthProvider} from '../../../types/types'

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
  selectedType: string
  authProviders: AuthProvider[]
}

export default class AuthProviderSidePanel extends React.Component<Props, {}> {
  render() {
    const authProvider = this.props.authProviders.find(x => x.type === this.props.selectedType)
    const text = texts[this.props.selectedType]
    return (
      <div className='flex flex-column justify-between'>
        <div className='w-100 flex flex-column'>
          <div
            className='w-100 white pa4 fw1'
            style={{
              backgroundColor: '#404040',
            }}
          >
            <div className='f3 b'>
              {text.title}
            </div>
            <div className='f5 mv3'>
              {text.description}
            </div>
            <div className='f5'>
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
              placeholder='consumerKey'
            />
            <input
              className='pa3 bg-light-gray br1 bn dark-gray f4'
              placeholder='consumerSecretKey'
            />
          </div>
          }
          {authProvider.type === 'AUTH_PROVIDER_AUTH0' &&
          <div className='pa4 flex flex-column'>
            <input
              className='pa3 bg-light-gray br1 bn dark-gray mb2 f4'
              placeholder='domain'
            />
            <input
              className='pa3 bg-light-gray br1 bn dark-gray mb2 f4'
              placeholder='clientId'
            />
            <input
              className='pa3 bg-light-gray br1 bn dark-gray mb2 f4'
              placeholder='clientSecret'
              type='password'
            />
          </div>
          }
        </div>
        <div className='flex justify-between pa3 bt b--light-gray'>
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
          <div className='flex items-center'>
            <div className='ph4 pv3 f4 dark-gray pointer dim'>
              Reset
            </div>
            <div className='ph4 pv3 f4 white bg-accent pointer dim'>
              Enable
            </div>
          </div>
        </div>
      </div>
    )
  }
}
