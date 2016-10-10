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

  render() {
    const id = randomString(5)
    const restProps = Object.assign({}, this.props)
    delete restProps.labelClassName

    return (
      <div className={classes.root}>
        <input
          id={id}
          {...restProps}
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
