import * as React from 'react'
import Tether from '../../../../components/Tether/Tether'
import {CellProps} from './cells'
import {stringToValue} from '../../../../utils/valueparser'

interface State {
  mouseOverTether: boolean
}

export default class StringCell extends React.Component<CellProps<string>, State> {

  state = {
    mouseOverTether: false,
  }

  render() {
    return (
      <Tether
        steps={[{
            step: 'STEP3_CLICK_ENTER_IMAGEURL',
            title: 'Enter an image url such this one.',
            buttonText: 'Copy example value',
            copyText: 'http://i.imgur.com/5ACuqm4.jpg',
          }, {
            step: 'STEP3_CLICK_ENTER_DESCRIPTION',
            title: 'Now enter a cool description.',
            description: `We're gonna put "#graphcool" in the description.`, // tslint:disable-line
            buttonText: 'Copy example value',
            copyText: '#graphcool',
          },
        ]}
        width={300}
        offsetX={-35}
        offsetY={5}
        onMouseEnter={() => this.setState({mouseOverTether: true})}
        onMouseLeave={() => this.setState({mouseOverTether: false})}
      >
        <textarea
          autoFocus
          type='text'
          ref='input'
          defaultValue={this.props.value}
          onKeyDown={this.props.onKeyDown}
          onBlur={(e: any) => this.props.save(stringToValue(e.target.value, this.props.field))}
        />
      </Tether>
    )
  }
}
