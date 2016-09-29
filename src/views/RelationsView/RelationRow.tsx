import * as React from 'react'
import * as Relay from 'react-relay'
import {Link, withRouter} from 'react-router'
import {Relation, Project} from '../../types/types'
import Icon from '../../components/Icon/Icon'
import RelationModels from './RelationModels'
import DeleteRelationMutation from '../../mutations/DeleteRelationMutation'
import {Transaction} from 'react-relay'
import {onFailureShowNotification} from '../../utils/relay'
import {ShowNotificationCallback} from '../../types/utils'
import {connect} from 'react-redux'
import {showNotification} from '../../actions/notification'
import {bindActionCreators} from 'redux'
const classes: any = require('./RelationRow.scss')

interface Props {
  router: ReactRouter.InjectedRouter
  relation: Relation
  project: Project
  onRelationDeleted: () => void
  showNotification: ShowNotificationCallback
}

class RelationRow extends React.Component<Props,{}> {

  render(): JSX.Element {
    const to = `/${this.props.project.name}/relations/edit/${this.props.relation.name}`
    return (
      <div className={classes.root} onClick={() => this.props.router.push(to)}>
        <div className={classes.row}>
          <div>
            <div>
              <span className={classes.name}>
                {this.props.relation.name}
              </span>
              <span>
              <RelationModels
                projectName={this.props.project.name}
                leftModel={this.props.relation.leftModel}
                rightModel={this.props.relation.rightModel}
                leftModelIsList={this.props.relation.fieldOnLeftModel.isList}
                rightModelIsList={this.props.relation.fieldOnRightModel.isList}
              />
              </span>
            </div>
            {this.props.relation.description &&
            <div className={classes.description}>
              {this.props.relation.description}
            </div>
            }
          </div>
          <span className={classes.buttons}>
            <span className={classes.icon}>
              <Link to={to}>
              <Icon
                width={20}
                height={20}
                src={require('assets/icons/edit.svg')}
              />
            </Link>
            </span>
            <span className={classes.icon} onClick={this.deleteRelation}>
              <Icon
                width={20}
                height={20}
                src={require('assets/icons/delete.svg')}
              />
            </span>
          </span>
        </div>
      </div>
    )
  }

  private deleteRelation = (e: React.MouseEvent<any>): void => {
    e.stopPropagation()

    if (window.confirm('Do you really want to delete this Relation?')) {
      Relay.Store.commitUpdate(
        new DeleteRelationMutation({
          relationId: this.props.relation.id,
          projectId: this.props.project.id,
          leftModelId: this.props.relation.leftModel.id,
          rightModelId: this.props.relation.rightModel.id,
        }),
        {
          onSuccess: this.props.onRelationDeleted,
          onFailure: (trans: Transaction) => onFailureShowNotification(trans, this.props.showNotification),
        })
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({showNotification}, dispatch)
}

const MappedRelationRow = connect(null, mapDispatchToProps)(withRouter(RelationRow))

export default Relay.createContainer(MappedRelationRow, {
  fragments: {
    relation: () => Relay.QL`
      fragment on Relation {
        id
        name
        description
        leftModel {
          id
          name
        }
        rightModel {
          id
          name
        }
        fieldOnLeftModel {
          id
          name
          isList
        }
        fieldOnRightModel {
          id
          name
          isList
        }
      }
    `,
  },
})
