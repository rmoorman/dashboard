import * as React from 'react'

export default class PopupWrapper extends React.Component<any, {}> {
  render() {
    return (
      <div
        className='fixed left-0 right-0 top-0 bottom-0 z-999'
        style={{
          pointerEvents: 'none',
          overflow: 'scroll',
        }}
      >
        {this.props.children}
      </div>
    )
  }
}
