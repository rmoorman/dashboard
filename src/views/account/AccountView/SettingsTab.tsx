import * as React from 'react'
import * as Relay from 'react-relay'
import { Viewer } from '../../../types/types'
import UpdateCustomerMutation from '../../../mutations/UpdateCustomerMutation'
import UpdatePasswordMutation from '../../../mutations/UpdatePasswordMutation'
import { onFailureShowNotification } from '../../../utils/relay'
import { ShowNotificationCallback } from '../../../types/utils'
const classes: any = require('./SettingsTab.scss')

interface Props {
  params: any
  viewer: Viewer
}

interface State {
  email: string
  name: string
  oldPassword: string
  newPasswordOne: string
  newPasswordTwo: string
}

class SettingsTab extends React.Component<Props, State> {

  static contextTypes: React.ValidationMap<any> = {
    showNotification: React.PropTypes.func.isRequired,
  }

  context: {
    showNotification: ShowNotificationCallback
  }

  constructor (props) {
    super(props)

    this.state = {
      email: this.props.viewer.user.crm.information.email,
      name: this.props.viewer.user.crm.information.name,
      oldPassword: '',
      newPasswordOne: '',
      newPasswordTwo: '',
    }
  }

  render () {
    return (
      <div className={classes.root}>
        <div className={classes.category}>
          <div className={classes.title}>
            Name
          </div>
          <input
            type='text'
            placeholder='Your name'
            value={this.state.name}
            className={classes.field}
            onChange={(e: any) => this.setState({ name: e.target.value } as State)}
          />
        </div>
        <div className={classes.category}>
          <div className={classes.title}>
            Email
          </div>
          <input
            type='text'
            placeholder='Your email'
            value={this.state.email}
            className={classes.field}
            onChange={(e: any) => this.setState({ email: e.target.value } as State)}
          />
        </div>
        <div className={classes.category}>
          <div className={classes.title}>
            Change password
          </div>
          <input
            type='password'
            value={this.state.oldPassword}
            placeholder='Enter current password'
            className={classes.field}
            onChange={(e: any) => this.setState({ oldPassword: e.target.value } as State)}
          />
          <input
            type='password'
            value={this.state.newPasswordOne}
            placeholder='Choose new password'
            className={classes.field}
            onChange={(e: any) => this.setState({ newPasswordOne: e.target.value } as State)}
          />
          <input
            type='password'
            value={this.state.newPasswordTwo}
            placeholder='Repeat new password'
            className={classes.field}
            onChange={(e: any) => this.setState({ newPasswordTwo: e.target.value } as State)}
          />
        </div>
        <div className={classes.saveChanges} onClick={this.saveChanges}>
          Save changes
        </div>
      </div>
    )
  }

  private saveChanges = () => {
    const nameWasChanged = this.props.viewer.user.crm.information.name !== this.state.name
    const emailWasChanged = this.props.viewer.user.crm.information.email !== this.state.email
    const passwordWasChanged = this.state.newPasswordOne !== '' && this.state.newPasswordTwo !== ''

    if (!nameWasChanged && !emailWasChanged && !passwordWasChanged) {
      this.context.showNotification('No changes to save...', 'info')
    }

    if (nameWasChanged || emailWasChanged) {
      this.handleCustomerChange()
    }

    if (passwordWasChanged) {
      this.handlePasswordChange()
    }
  }

  private handleCustomerChange () {
    Relay.Store.commitUpdate(
      new UpdateCustomerMutation({
        customerId: this.props.viewer.user.id,
        email: this.state.email,
        name: this.state.name,
      }),
      {
        onSuccess: () => {
          this.context.showNotification('Changes to email and name were saved.', 'success')
        },
        onFailure: (transaction) => {
          onFailureShowNotification(transaction, this.context.showNotification)
        },
      }
    )
  }

  private handlePasswordChange () {
    if (this.state.newPasswordOne !== '' && this.state.newPasswordOne === this.state.newPasswordTwo) {
      Relay.Store.commitUpdate(
        new UpdatePasswordMutation({
          customerId: this.props.viewer.user.id,
          oldPassword: this.state.oldPassword,
          newPassword: this.state.newPasswordOne,
        }),
        {
          onSuccess: () => {
            this.context.showNotification('Changes to password successful.', 'success')
            this.setState({
              oldPassword: '',
              newPasswordOne: '',
              newPasswordTwo: '',
            } as State)
          },
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.context.showNotification)
          },
        }
      )
    } else {
      this.context.showNotification('Please enter the same new password twice.', 'error')
    }
  }
}

export default Relay.createContainer(SettingsTab, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id
          crm {
            information {
              name
              email
            }
          }
        }
      }
    `,
  },
})
