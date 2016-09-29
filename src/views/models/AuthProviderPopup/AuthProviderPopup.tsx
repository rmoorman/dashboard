import * as React from 'react'
import Icon from '../../../components/Icon/Icon'

interface Props {
}

export default class AuthProviderPopup extends React.Component<Props, {}> {

  render() {
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
              <div className='flex pa4 bb b--light-gray items-center dim pointer'>
                <Icon
                  src={require('assets/icons/logo.svg')}
                  width={40}
                  height={40}
                />
                <div className='fw1 f4 mh3'>
                  Email/Pass
                </div>
                <div>
                  <Icon
                    src={require('assets/new_icons/check.svg')}
                  />
                </div>
              </div>
              <div className='flex pa4 bb b--light-gray items-center dim pointer'>
                <Icon
                  src={require('assets/icons/logo.svg')}
                  width={40}
                  height={40}
                />
                <div className='fw1 f4 mh3'>
                  Email/Pass
                </div>
                <div>
                  <Icon
                    src={require('assets/new_icons/check.svg')}
                  />
                </div>
              </div>
              <div className='flex pa4 bb b--light-gray items-center dim pointer'>
                <Icon
                  src={require('assets/icons/logo.svg')}
                  width={40}
                  height={40}
                />
                <div className='fw1 f4 mh3'>
                  Email/Pass
                </div>
                <div>
                  <Icon
                    src={require('assets/new_icons/check.svg')}
                  />
                </div>
              </div>
            </div>
            <div className='flex flex-column justify-between'>
              <div className='w-100 flex flex-column'>
                <div
                  className='w-100 white pa4 fw1'
                  style={{
                    backgroundColor: '#404040',
                  }}
                >
                  <div className='f3 b'>
                    Digits - Two-Step Phone Authentication
                  </div>
                  <div className='f5 mv3'>
                    Digits offers two-step authentification via a phone number and a code
                    <br/>
                    that is send to respective number.
                  </div>
                  <div className='f5'>
                    <a href='www.digits.com' className='white underline'>
                      www.digits.com
                    </a>
                  </div>
                </div>
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
          </div>
        </div>
      </div>
    )
  }

}
