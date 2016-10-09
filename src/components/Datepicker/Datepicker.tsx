import * as React from 'react'
import { ISO8601 } from '../../utils/constants'
import * as moment from 'moment'
import { Moment } from 'moment'
import ClickOutside from 'react-click-outside'
import Datetime from 'react-datetime'
const classes: any = require('./Datepicker.scss')

// TODO remove once closed: https://github.com/YouCanBookMe/react-datetime/issues/44
Datetime.prototype.componentWillReceiveProps = function (nextProps) {
  if (this.props.open !== nextProps.open) {
    this.setState({ open: nextProps.open })
  }
}

require('react-datetime/css/react-datetime.css')

interface Props {
  applyImmediately: boolean
  defaultOpen: boolean
  className?: string
  defaultValue: Date
  onChange: (m: Moment) => void
  onKeyDown?: (e: any) => void
  onCancel?: () => void
  // NOTE custom `onFocus` impl needed because overriding this property breaks the package
  onFocus?: () => void
  onClickOutside?: (moment: any) => void
  [key: string]: any
}

interface State {
  moment: Moment
  open: boolean
}

export default class DatePicker extends React.Component<Props, State> {

  refs: {
    [key: string]: any
    container: Element
  }

  constructor (props) {
    super(props)

    this.state = {
      moment: moment.utc(props.defaultValue, ISO8601),
      open: props.defaultOpen || false,
    }

    this._onKeyDown = this._onKeyDown.bind(this)
  }


  componentDidMount() {
    document.addEventListener('keydown', this._onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._onKeyDown)
  }

  _onKeyDown (e: any) {
    // fake event data, as the document doesn't have a value ...
    e.target.value = this.state.moment
    this.props.onKeyDown(e)
  }

  _onChange (m: Moment) {
    if (this.props.applyImmediately) {
      this._applyChange(m)
    } else {
      this.setState({ moment: m } as State)
    }
  }

  _applyChange (m: Moment) {
    this.setState({ open: false } as State)
    this.props.onChange(m)
  }

  _onCancel () {
    this.setState({ open: false } as State)
    if (this.props.onCancel) {
      this.props.onCancel()
    }
  }

  _markOpen () {
    if (!this.state.open) {
      this.setState({ open: true } as State)

      if (this.props.onFocus) {
        this.props.onFocus()
      }
    }
  }

  render () {
    const passThroughProps: any = Object.assign({}, this.props)

    delete passThroughProps.onChange
    delete passThroughProps.dateFormat
    delete passThroughProps.className
    delete passThroughProps.inputProps
    delete passThroughProps.open
    delete passThroughProps.onFocus

    return (
      <div
        className={`${classes.root} ${this.props.className}`}
        onClick={() => this._markOpen()}
        ref='container'
      >
        <ClickOutside onClickOutside={() => this.props.onClickOutside(this.state.moment)}>
          <Datetime
            {...passThroughProps}
            className={classes.datetime}
            dateFormat='YYYY-MM-DD'
            timeFormat='HH:mm:ssZZ'
            onChange={(m) => this._onChange(m)}
            open={this.state.open}
          />
          {!this.props.applyImmediately && this.state.open &&
            <div className={classes.buttons}>
              <span onClick={() => this._applyChange(this.state.moment)}>Ok</span>
              <span onClick={() => this._onCancel()}>Cancel</span>
            </div>
          }
        </ClickOutside>
      </div>
    )
  }
}
