import * as React from 'react'
import {withRouter} from 'react-router'

interface Props {
  to: string
  router: any
}

class RedirectOnMount extends React.Component<Props, {}> {

  componentWillMount () {
    this.props.router.replace(this.props.to)
  }

  render () {
    return null
  }
}

export default withRouter(RedirectOnMount)
