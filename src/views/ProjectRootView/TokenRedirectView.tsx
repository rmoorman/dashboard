import * as React from 'react'
import { updateNetworkLayer } from '../../utils/relay'
import { getQueryVariable } from '../../utils/location'
import * as cookiestore from 'cookiestore'

export default class TokenRedirectView extends React.Component<{}, {}> {

  componentWillMount () {
    const token = getQueryVariable('token')
    const customerId = getQueryVariable('customer_id')
    if (token) {
      window.localStorage.clear()
      cookiestore.set('graphcool_auth_token', token)
      cookiestore.set('graphcool_customer_id', customerId)
      updateNetworkLayer()
      window.location.href = window.location.origin
    }
  }

  render () {
    return (
      <div>Redirecting...</div>
    )
  }
}
