import * as React from 'react'
import * as Relay from 'react-relay'
import {Link, withRouter} from 'react-router'
import FieldRow from './FieldRow'
import mapProps from '../../../components/MapProps/MapProps'
import ScrollBox from '../../../components/ScrollBox/ScrollBox'
import Icon from '../../../components/Icon/Icon'
import Tether from '../../../components/Tether/Tether'
import ModelHeader from '../ModelHeader'
import DeleteModelMutation from '../../../mutations/DeleteModelMutation'
import {Field, Model, Viewer, Project} from '../../../types/types'
import {GettingStartedState} from '../../../types/gettingStarted'
import {ShowNotificationCallback} from '../../../types/utils'
import {onFailureShowNotification} from '../../../utils/relay'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {isScalar} from '../../../utils/graphql'
import {nextStep} from '../../../actions/gettingStarted'
import {validateModelName} from '../../../utils/nameValidator'
import UpdateModelNameMutation from '../../../mutations/UpdateModelNameMutation'
const classes: any = require('./StructureView.scss')

interface Props {
  params: any
  possibleRelatedPermissionPaths: Field[][]
  availableUserRoles: string[]
  fields: Field[]
  allModels: Model[]
  project: Project
  model: Model
  gettingStartedState: GettingStartedState
  nextStep: any
  router: any
  route: any
  children: Element
  viewer: Viewer
  relay: Relay.RelayProp
}

interface State {
  menuDropdownVisible: boolean
}

class StructureView extends React.Component<Props, State> {

  static contextTypes = {
    showNotification: React.PropTypes.func.isRequired,
  }

  context: {
    showNotification: ShowNotificationCallback
  }

  state = {
    menuDropdownVisible: false,
  }

  componentDidMount() {
    analytics.track('models/structure: viewed', {
      model: this.props.params.modelName,
    })
  }

  render() {

    const scalars = this.props.fields.filter((field) => isScalar(field.typeIdentifier))
    const relations = this.props.fields.filter((field) => !isScalar(field.typeIdentifier))
    const urlPrefix = `/${this.props.params.projectName}`
    return (
      <div className={classes.root}>
        {this.props.children}
        <ModelHeader
          params={this.props.params}
          model={this.props.model}
          viewer={this.props.viewer}
          project={this.props.project}
        >
          <Tether
            steps={[{
              step: 'STEP3_CREATE_TEXT_FIELD',
              title: 'Add a new field called "imageUrl" and select type "String". Then click the "Create" button.',
            }, {
              step: 'STEP4_CREATE_COMPLETED_FIELD',
              title: 'Good job! Create another one called "description" with type "String"',
            }]}
            offsetX={5}
            offsetY={5}
            width={240}
          >
            <Link
              className={`${classes.button} ${classes.green}`}
              to={`${urlPrefix}/models/${this.props.params.modelName}/structure/create`}
            >
              <Icon
                width={16}
                height={16}
                src={require('assets/icons/add.svg')}
              />
              <span>Create Field</span>
            </Link>
          </Tether>
          {!this.props.model.isSystem &&
          <div className={classes.button} onClick={this.toggleMenuDropdown}>
            <Icon
              width={16}
              height={16}
              src={require('assets/icons/more.svg')}
            />
          </div>}
          {this.state.menuDropdownVisible &&
          <div className={classes.menuDropdown}>
            <div onClick={this.renameModel}>
              Rename Model
            </div>
            <div onClick={this.deleteModel}>
              Delete Model
            </div>
          </div>
          }
        </ModelHeader>
        <div className={classes.table}>
          <div className={classes.tableHead}>
            <div className={classes.fieldName}>Fieldname</div>
            <div className={classes.type}>Type</div>
            <div className={classes.description}>Description</div>
            <div className={classes.constraints}>Constraints</div>
            <div className={classes.permissions}>Permissions</div>
            <div className={classes.controls}/>
          </div>
          <div className={classes.tableBody}>
            <ScrollBox>
              {scalars.map((field) => (
                <FieldRow
                  route={this.props.route}
                  key={field.id}
                  field={field}
                  params={this.props.params}
                  model={this.props.model}
                  allModels={this.props.allModels}
                  possibleRelatedPermissionPaths={this.props.possibleRelatedPermissionPaths}
                  availableUserRoles={this.props.availableUserRoles}
                />
              ))}
              <hr/>
              <div className={classes.relationHeader}>
                <div>
                  Relations
                </div>
                <div>
                  <Link
                    className={`${classes.button} ${classes.green}`}
                    to={`${urlPrefix}/relations/create?leftModelName=${this.props.params.modelName}`}
                  >
                    <Icon
                      width={16}
                      height={16}
                      src={require('assets/icons/add.svg')}
                    />
                    <span>Create Relation</span>
                  </Link>
                </div>
              </div>
              {relations.length === 0 &&
                <div className={classes.noRelations}>
                  No Relations
                </div>
              }
              {relations.map((field) => (
                <FieldRow
                  route={this.props.route}
                  key={field.id}
                  field={field}
                  params={this.props.params}
                  model={this.props.model}
                  allModels={this.props.allModels}
                  possibleRelatedPermissionPaths={this.props.possibleRelatedPermissionPaths}
                  availableUserRoles={this.props.availableUserRoles}
                />
              ))}
            </ScrollBox>
          </div>
        </div>
      </div>
    )
  }

  private toggleMenuDropdown = () => {
    this.setState({menuDropdownVisible: !this.state.menuDropdownVisible} as State)
  }

  private renameModel = () => {
    let modelName = window.prompt('Model name:')
    while (modelName != null && !validateModelName(modelName)) {
      modelName = window.prompt('The inserted model name was invalid. Enter a valid model name, ' +
                                'like "Model" or "MyModel" (first-letter capitalized and no spaces):')
    }
    const redirect = () => {
      this.props.router.replace(`/${this.props.params.projectName}/models/${modelName}`)
    }

    if (modelName) {
      Relay.Store.commitUpdate(
        new UpdateModelNameMutation({
          name: modelName,
          modelId: this.props.model.id,
        }),
        {
          onSuccess: () => {
            analytics.track('model renamed', {
              project: this.props.params.projectName,
              model: modelName,
            })
            redirect()
          },
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.context.showNotification)
          },
        }
      )
    }
  }

  private deleteModel = () => {
    this.toggleMenuDropdown()

    if (window.confirm('Do you really want to delete this model?')) {
      this.props.router.replace(`/${this.props.params.projectName}/models`)

      Relay.Store.commitUpdate(
        new DeleteModelMutation({
          projectId: this.props.project.id,
          modelId: this.props.model.id,
        }),
        {
          onSuccess: () => {
            analytics.track('models/structure: deleted model', {
              project: this.props.params.projectName,
              model: this.props.params.modelName,
            })
          },
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.context.showNotification)
          },
        }
      )
    }
  }
}

// id field should always be first
const customCompare = (fieldNameA, fieldNameB) => {
  if (fieldNameA !== 'id' && fieldNameB !== 'id') {
    return fieldNameA.localeCompare(fieldNameB)
  }

  return fieldNameA === 'id' ? -1 : 1
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({nextStep}, dispatch)
}

const ReduxContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StructureView)

const MappedStructureView = mapProps({
  relay: (props) => props.relay,
  viewer: (props) => props.viewer,
  params: (props) => props.params,
  availableUserRoles: (props) => props.viewer.project.availableUserRoles,
  allModels: (props) => props.viewer.project.models.edges.map((edge) => edge.node),
  possibleRelatedPermissionPaths: (props) => (
    props.viewer.model.possibleRelatedPermissionPaths.edges
      .map((edge) => edge.node.fields)
  ),
  fields: (props) => (
    props.viewer.model.fields.edges
      .map((edge) => edge.node)
      .sort((a, b) => customCompare(a.name, b.name))
  ),
  model: (props) => props.viewer.model,
  project: (props) => props.viewer.project,
})(ReduxContainer)

export default Relay.createContainer(withRouter(MappedStructureView), {
  initialVariables: {
    modelName: null, // injected from router
    projectName: null, // injected from router
  },
    fragments: {
        viewer: () => Relay.QL`
            fragment on Viewer {
                model: modelByName(projectName: $projectName, modelName: $modelName) {
                    id
                    isSystem
                    possibleRelatedPermissionPaths(first: 100) {
                        edges {
                            node {
                                fields {
                                    id
                                    name
                                    typeIdentifier
                                }
                            }
                        }
                    }
                    fields(first: 100) {
                        edges {
                            node {
                                id
                                name
                                typeIdentifier
                                relation {
                                    name
                                }
                                ${FieldRow.getFragment('field')}
                            }
                        }
                    }
                    ${ModelHeader.getFragment('model')}
                }
                project: projectByName(projectName: $projectName) {
                    id
                    name
                    availableUserRoles
                    models(first: 1000) {
                        edges {
                            node {
                                id
                                name
                                unconnectedReverseRelationFieldsFrom(relatedModelName: $modelName) {
                                    id
                                    name
                                    relation {
                                        id
                                    }
                                }
                            }
                        }
                    }
                    ${ModelHeader.getFragment('project')}
                }
                ${ModelHeader.getFragment('viewer')}
            }
        `,
    },
})
