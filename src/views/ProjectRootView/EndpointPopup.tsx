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

    const Popup = styled.div`
      width: 600px;
      max-width: 90%;
    `

    const Separator = styled.div`
      
      position: relative;
      display: flex;
      justify-content: center;
    
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 100%;
        height: 1px;
        top: 50%;
        background: ${variables.gray10};
      }
    `

    const activeEndpointType = `
      background: ${variables.blue};
      padding: 11px;
      border-radius: 1px;
      cursor: default;
      color: ${variables.white};
      
      &:hover {
        color: ${variables.white};
        background: ${variables.blue};
      }
    `

    const EndpointType = styled.div`
      background: ${variables.gray07};
      padding: ${variables.size10};
      color: ${variables.gray30};
      letter-spacing: 1px;
      cursor: pointer;
      transition: color ${variables.duration} linear, background ${variables.duration} linear;
      
      &:first-child {
        border-left-top-radius: 1px;
        border-left-bottom-radius: 1px;
      }
      
      &:last-child {
        border-right-top-radius: 1px;
        border-right-bottom-radius: 1px;
      }
      
      &:hover {
        background: ${variables.gray10};
        color: ${variables.gray50};
      }
      
     ${props => props.active && activeEndpointType}
    `

    const EndpointField = styled.div`
      &:after {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        background: linear-gradient(to left, ${variables.white} 0%, rgba(255,255,255,0) 80%);
        width: 25px;
      }
    `

    const Copy = styled.div`
      i {
        transition: fill ${variables.duration} linear, background ${variables.duration} linear;
      }
    
      &:hover {
        i {
          background: ${variables.gray04};
          fill: ${variables.gray60};
        } 
      }
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
        <Popup className={cx(particles.bgWhite, particles.br2)} style={{pointerEvents: 'all'}}>
          <header className={cx(particles.relative, particles.pa60)}>
            <h1 className={cx(particles.fw3, particles.f38, particles.tc)}>
              API Endpoints
            </h1>
            <div
              className={cx(
                particles.absolute,
                particles.pa25,
                particles.top0,
                particles.right0,
                particles.pointer,
              )}
              onClick={() => this.props.closePopup(this.props.id)}
            >
              <Icon width={25} height={25} stroke src={require('graphcool-styles/icons/stroke/cross.svg')} />
            </div>
          </header>
          <Separator>
            <div className={cx(
              particles.relative,
              particles.ph16,
              particles.bgWhite,
              particles.f14,
              particles.fw6,
              particles.ttu,
              particles.flex,
              particles.itemsCenter,
            )}>
              <EndpointType active>Relay</EndpointType>
              <EndpointType>Simple</EndpointType>
              <EndpointType>File</EndpointType>
            </div>
          </Separator>
          <div className={cx(particles.flex, particles.ph38)}>
            <EndpointField className={cx(
              particles.f25,
              particles.fw3,
              particles.pv38,
              particles.overflowHidden,
              particles.relative,
            )}>
              {'https://api.graph.cool/simple/v1/cim2556e300e20plm8aj7e4wo'}
            </EndpointField>
            <Copy className={cx(
              particles.relative,
              particles.bgWhite,
              particles.selfCenter,
              particles.br2,
              particles.buttonShadow,
              particles.pointer,
            )}>
              <Icon
                width={38}
                height={38}
                color={variables.gray50}
                src={require('graphcool-styles/icons/fill/copy.svg')}
              />
            </Copy>
          </div>
          <p className={cx(
            particles.bt,
            particles.bBlack10,
            particles.pa38,
            particles.lhCopy,
            particles.black50,
          )}>
            Here's space for a short description what to do with the endpoint(s). A link to the documentation could also be helpful.
          </p>
        </Popup>
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
