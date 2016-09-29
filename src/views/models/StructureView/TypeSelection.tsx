import * as React from 'react'
import { findDOMNode } from 'react-dom'
import Icon from '../../../components/Icon/Icon'
import ScrollBox from '../../../components/ScrollBox/ScrollBox'
import ClickOutside from 'react-click-outside'
const classes: any = require('./TypeSelection.scss')

const types = [
  'Int',
  'Float',
  'Boolean',
  'String',
  'DateTime',
  'Enum',
  'Json',
]

interface Props {
  selected: string
  select: (typeIdentifier: string) => void
}

interface State {
  open: boolean
}

export default class TypeSelection extends React.Component<Props, State> {

  refs: {
    [key: string]: any;
    scroll: ScrollBox
  }

  state = {
    open: false,
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.listenForKeys, true)
  }

  componentWillUpdate (nextProps, nextState) {
    if (!this.state.open && nextState.open) {
      window.addEventListener('keydown', this.listenForKeys, true)
    } else if (this.state.open && !nextState.open) {
      window.removeEventListener('keydown', this.listenForKeys, true)
    }
  }

  render () {
    if (!this.state.open) {
      return (
        <div
          className={classes.root}
          tabIndex={0}
          onClick={() => this.open()}
          onFocus={() => this.open()}
        >
          <div className={classes.preview}>
            <span>
              {this.props.selected}
            </span>
            <Icon
              width={11}
              height={6}
              src={require('assets/icons/arrow.svg')}
              />
          </div>
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <ClickOutside onClickOutside={() => this.close()}>
          <div className={classes.overlay} ref='overlay'>
            <ScrollBox
              ref='scroll'
              innerContainerClassName={classes.scrollInnerContainer}
              outerContainerClassName={classes.scrollOuterContainer}
            >
              <div className={classes.list}>
                {types.map((type) => (
                  <div
                    key={type}
                    onClick={() => this.select(type)}
                    className={type === this.props.selected ? classes.selected : ''}
                  >
                    {type}
                  </div>
                ))}
              </div>
            </ScrollBox>
          </div>
        </ClickOutside>
      </div>
    )
  }

  private select (type) {
    this.props.select(type)
    this.setState({ open: false })
  }

  private open () {
    this.setState({ open: true })
  }

  private close () {
    this.setState({ open: false })
  }

  private listenForKeys = (e: KeyboardEvent) => {
    const allTypes = [...types]
    let selectedIndex = allTypes.indexOf(this.props.selected)

    switch (e.keyCode) {
      case 9: // tab
      case 13: // enter
      case 27: // esc
        e.stopPropagation()
        return this.close()
      case 40:
      case 74: // j
        selectedIndex++
        break
      case 38:
      case 75: // k 
        selectedIndex--
        break
    }

    selectedIndex = (selectedIndex + allTypes.length) % allTypes.length

    this.props.select(allTypes[selectedIndex])

    const relativePosition = selectedIndex / allTypes.length
    const outerContainerElement = findDOMNode(this.refs.scroll.refs.outerContainer)
    const innerContainerElement = findDOMNode(this.refs.scroll.refs.innerContainer)
    outerContainerElement.scrollTop = innerContainerElement.clientHeight * relativePosition
  }
}
