import * as React from 'react'
import {randomString} from '../../utils/utils'

const classes: any = require('./FloatingInput.scss')

interface Props {
  label: string
  labelClassName?: string
  [key: string]: any
}

interface State {
}

export default class FloatingLabel extends React.Component<Props, State> {

  render () {
    const id = randomString(5)
    return(
      <div className={classes.root}>
        <input
          id={id}
          {...this.props}
        />
        <label
          htmlFor={id}
          className={this.props.labelClassName}
        >
          {this.props.label}
        </label>
      </div>
    )
  }
}
