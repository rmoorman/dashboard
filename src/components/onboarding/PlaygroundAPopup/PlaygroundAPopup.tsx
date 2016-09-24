import * as React from 'react'

interface Props {
}

export default class PlaygroundAPopup extends React.Component<Props, {}> {

  render() {
    return (
      <div className='flex justify-center items-center h-100 w-100 bg-white-50' style={{pointerEvents: 'all'}}>
        <div className='bg-white br-2 flex shadow-2' style={{ minWidth: 1000, maxWidth: 1200 }}>
          Do magic here. You can also adjust the classes of these wrapping divs
        </div>
      </div>
    )
  }
}

