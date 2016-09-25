import * as React from 'react'
import * as Relay from 'react-relay'
import { Field } from '../../../types/types'
import { isScalar } from '../../../utils/graphql'
import { onFailureShowNotification } from '../../../utils/relay'
import { ShowNotificationCallback } from '../../../types/utils'
import {connect} from 'react-redux'
import {showNotification} from '../../../actions/notification'
import {bindActionCreators} from 'redux'
import UpdateFieldIsUniqueMutation from '../../../mutations/UpdateFieldIsUniqueMutation'
const classes: any = require('./Constraints.scss')

interface Props {
  field: Field
  showNotification: ShowNotificationCallback
}

class Constraints extends React.Component<Props, {}> {

  render () {
    const disabled = this.props.field.isSystem || !isScalar(this.props.field.typeIdentifier)
    return (
      <div className={classes.root}>
        <div className={classes.header}>Constraints</div>
        <div className={classes.row}>
          <label className={disabled ? classes.disabled : ''}>
            <input
              disabled={disabled}
              type='checkbox'
              checked={this.props.field.isUnique}
              onChange={(e) => this.updateIsUnique((e.target as HTMLInputElement).checked)}
            />
            This field is unique
          </label>
        </div>
      </div>
    )
  }

  private updateIsUnique (isUnique: boolean) {
    Relay.Store.commitUpdate(
      new UpdateFieldIsUniqueMutation({
        fieldId: this.props.field.id,
        isUnique,
      }),
      {
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.props.showNotification)
        },
      }
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({showNotification}, dispatch)
}

export default connect(null, mapDispatchToProps)(Constraints)
