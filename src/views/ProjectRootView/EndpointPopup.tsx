import * as React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {ReduxAction} from '../../types/reducers'
import {closePopup} from '../../actions/popup'
import styled from 'styled-components'
import {particles, variables} from 'graphcool-styles'
import * as cx from 'classnames'

interface Props {
  id: string
  closePopup: (id: string) => ReduxAction
}

interface State {
}

class EndpointPopup extends React.Component<Props, State> {

  render() {

    const activeEndpointType = `
      background: ${variables.blue};
      color: ${variables.white}
    `

    const EndpointType = styled.div`
      background: ${variables.gray07};
      padding: ${variables.size16};
      color: ${variables.gray30};
      letter-spacing: 1px;
      border-radius: 2px;
      
     ${props => props.active && activeEndpointType}
    `

    return (
      <div className={cx(
        particles.flex,
        particles.bgBlack50,
        particles.w100,
        particles.h100,
        particles.justifyCenter,
        particles.itemsCenter,
      )}>
        <div className={cx(particles.bgWhite, particles.br2)} style={{pointerEvents: 'all'}}>

          <div className={cx(particles.pa25, particles.flex, particles.itemsCenter)}>
            <div className={cx(
              particles.f14,
              particles.fw6,
              particles.ttu,
              particles.flex,
              particles.itemsCenter,
            )}>
              <EndpointType>Relay</EndpointType>
              <EndpointType active >Simple</EndpointType>
            </div>
            <div className={cx(
              particles.ph25,
              particles.f25,
              particles.fw3,

            )}>
              {'https://api.graph.cool/simple/v1/cim2556e300e20plm8aj7e4wo'}
            </div>

          </div>

          <div className={cx(
            particles.flex,
            particles.justifyEnd,
            particles.bt,
            particles.bBlack20,
            particles.pa25,
          )}>
            <div
              className={cx(
              particles.pa16,
              particles.bgBlue,
              particles.br2,
              particles.white,
              particles.f16,
              particles.pointer

            )}
              onClick={() => this.props.closePopup(this.props.id)}
            >
              Close
            </div>
          </div>

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({closePopup}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EndpointPopup)
