import * as React from 'react'
import PopupWrapper from '../../components/PopupWrapper/PopupWrapper'
import Icon from '../../components/Icon/Icon'

export default class SignUpView extends React.Component<{}, {}> {
  render() {
    return (
      <div className='bg-accent w-100 h-100' style={{pointerEvents: 'none'}}>
        <PopupWrapper>
          <div className='flex justify-center items-center w-100 h-100 fw1' style={{pointerEvents: 'all'}}>
            <div
              className='tc bg-white br1 shadow-2'
              style={{
                width: 440,
              }}
            >
              <div className='ttu mv-38'>
                Sign Up
              </div>
              <div className='mb-38 f-38'>
                Nice that you're here.
              </div>
              <div className='w-100 tc pt-16'>
                Sign up using
              </div>
              <div className='flex justify-between pa-16 white'>
                <div className='w-50 pr-6'>
                  <div
                    className='w-100 flex justify-center items-center pa-16 br1 f-25 pointer'
                    style={{
                      backgroundColor: '#55ACEE',
                    }}
                  >
                    <Icon
                      src={require('../../assets/new_icons/twitter.svg')}
                      color={'white'}
                      height={25}
                      width={25}
                    />
                    <span className='pl-6'>Twitter</span>
                  </div>
                </div>
                <div className='w-50 pl-6'>
                  <div className='w-100 flex justify-center items-center pa-16 br1 bg-dark-gray f-25 pointer'>
                    <Icon
                      src={require('../../assets/new_icons/github.svg')}
                      color={'white'}
                      height={25}
                      width={25}
                    />
                    <span className='pl-6'>Github</span>
                  </div>
                </div>
              </div>
              <div className='w-100 tc'>
                or fill out all those fields
              </div>
              <div className='flex justify-between pa-16'>
                <div className='w-50 pr-6'>
                  <div className='w-100'>
                    <input
                      type='text'
                      className='w-100 pa-16 br2 bg-light-gray bn'
                      placeholder='First Name'
                    />
                  </div>
                </div>
                <div className='w-50 pl-6'>
                  <div className='w-100'>
                    <input
                      type='text'
                      className='w-100 pa-16 br2 bg-light-gray bn'
                      placeholder='Last Name'
                    />
                  </div>
                </div>
              </div>
              <div className='w-100 ph-16 pb-16'>
                <input
                  type='email'
                  className='w-100 pa-16 br2 bg-light-gray bn'
                  placeholder='Email'
                />
              </div>
              <div className='w-100 ph-16 pb-16'>
                <input
                  type='password'
                  className='w-100 pa-16 br2 bg-light-gray bn'
                  placeholder='Password'
                />
              </div>
              <hr className='ma0'/>
              <div className='flex justify-center w-100 pa-16'>
                <div className='pa-16 f-25'>
                  <span>Sign up</span>
                </div>
              </div>
            </div>
          </div>
        </PopupWrapper>
      </div>
    )
  }
}