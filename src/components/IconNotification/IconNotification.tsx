import * as React from 'react'
import TemporaryNotification from '../TemporaryNotification/TemporaryNotification'
import Icon from '../Icon/Icon'

interface Props {
  id: string
}

export default class IconNotification extends React.Component<Props, {}> {

  render() {
    return (
      <TemporaryNotification id={this.props.id}>
        <div className='flex flex-column items-center justify-center pa4 br4 bg-white-80'>
          <div
            style={{
              width: 75,
              height: 75,
            }}
          >
            <Icon width={75} height={75} src={require('../../assets/icons/check.svg')} />
          </div>
          <div className='f1 black'>
            done
          </div>
        </div>
      </TemporaryNotification>
    )
  }
}
