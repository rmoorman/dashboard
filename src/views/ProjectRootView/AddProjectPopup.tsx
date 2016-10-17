import * as React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {ReduxAction} from '../../types/reducers'
import {closePopup} from '../../actions/popup'
import styled from 'styled-components'
import {particles, variables, Icon} from 'graphcool-styles'
import * as cx from 'classnames'

interface Props {
  id: string
  closePopup: (id: string) => ReduxAction
}

interface State {
}

class AddProjectPopup extends React.Component<Props, State> {

  render() {
    return (
      <div className={cx(
        particles.flex,
        particles.bgBlack50,
        particles.w100,
        particles.h100,
        particles.justifyCenter,
        particles.itemsCenter,
      )}>
        Add model
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
)(AddProjectPopup)
