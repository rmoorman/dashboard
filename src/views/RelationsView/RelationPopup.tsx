import * as React from 'react'
import * as Relay from 'react-relay'
import {withRouter} from 'react-router'
import Popup from '../../components/Popup/Popup'
import RelationSelector from './RelationSelector'
import RelationExplanation from '../../components/RelationExplanation/RelationExplanation'
import GeneratedMutations from '../../components/GeneratedMutations/GeneratedMutations'
import AddRelationMutation from '../../mutations/AddRelationMutation'
import {validateModelName, validateFieldName} from '../../utils/nameValidator'
import {classnames} from '../../utils/classnames'
import UpdateRelationMutation from '../../mutations/UpdateRelationMutation'
import {ShowNotificationCallback} from '../../types/utils'
import {connect} from 'react-redux'
import {showNotification} from '../../actions/notification'
import {bindActionCreators} from 'redux'
import {onFailureShowNotification} from '../../utils/relay'
import {getModelName, getModelNamePlural} from '../../utils/namegetter'
import Help from '../../components/Help/Help'
import {Transaction} from 'react-relay'

const classes: any = require('./RelationPopup.scss')

interface Props {
  location: any
  viewer: any
  relay: Relay.RelayProp
  router: ReactRouter.InjectedRouter
  showNotification: ShowNotificationCallback
}

interface State {
  name: string
  description: string
  fieldOnLeftModelName: string
  fieldOnRightModelName: string
  fieldOnLeftModelIsList: boolean
  fieldOnRightModelIsList: boolean
  leftModelId: string
  rightModelId: string
  alertHint: boolean
  showExplanation: boolean
  fieldsEdited: boolean
}

class RelationPopup extends React.Component<Props, State> {

  refs: {
    [key: string]: any;
    input: HTMLInputElement
  }

  constructor(props: Props) {
    super(props)

    const {relation} = this.props.viewer
    this.state = relation ? this.getExistingRelationState() : this.getNewRelationState()
  }

  render(): JSX.Element {
    const models = this.props.viewer.project.models.edges.map((edge) => edge.node)
    return (
      <Popup onClickOutside={this.close} height={'100%'}>
        <div className={classes.root}>
          <div className={classes.header}>
            {this.props.viewer.relation ? 'Edit Relation' : 'New Relation'}
          </div>
          <div className={classes.container}>
            <div className={classes.content}>
              <div className={classes.title}>
                Relation Schema
              </div>
              <div className={classes.settings}>
                <div className={classes.container}>
                  <RelationSelector
                    models={models}
                    fieldOnLeftModelName={this.state.fieldOnLeftModelName}
                    fieldOnRightModelName={this.state.fieldOnRightModelName}
                    fieldOnLeftModelIsList={this.state.fieldOnLeftModelIsList}
                    fieldOnRightModelIsList={this.state.fieldOnRightModelIsList}
                    leftModelId={this.state.leftModelId}
                    rightModelId={this.state.rightModelId}
                    onFieldOnLeftModelNameChange={
                      (val) => this.setState({
                          fieldOnLeftModelName: val,
                          fieldsEdited: true,
                        } as State)
                    }
                    onFieldOnRightModelNameChange={
                      (val) => this.setState({
                          fieldOnRightModelName: val,
                          fieldsEdited: true,
                        } as State)
                    }
                    onFieldOnLeftModelIsListChange={
                      (val) => this.setState(
                        {
                          fieldOnLeftModelIsList: val,
                        } as State,
                        this.prepopulateFields)
                    }
                    onFieldOnRightModelIsListChange={
                      (val) => this.setState(
                        {
                          fieldOnRightModelIsList: val,
                        } as State,
                        this.prepopulateFields)
                    }
                    onLeftModelIdChange={this.handleLeftModelIdChange}
                    onRightModelIdChange={this.handleRightModelIdChange}
                  />
                </div>
              </div>
              {this.state.leftModelId && this.state.rightModelId &&
              <div className={classes.descriptors}>
                <div className={classes.name}>
                  <label>Name</label>
                  <input
                    id='nameInput'
                    autoFocus={!this.props.viewer.relation}
                    ref='input'
                    type='text'
                    placeholder='+ Add Relation Name'
                    value={this.state.name}
                    onChange={(e: any) => this.setState(
                      {
                        name: e.target.value,
                        alertHint: !validateModelName(e.target.value) || e.target.value === '',
                      } as State)}
                  />
                  {this.state.alertHint &&
                  <Help
                    size={35}
                    text={'The relation name has to be capitalized.'}
                    placement={'right'}
                  />
                  }
                </div>
                <div className={classes.description}>
                  <input
                    type='text'
                    placeholder='+ Add Description'
                    value={this.state.description}
                    onChange={(e: any) => this.setState({ description: e.target.value } as State)}
                  />
                </div>
              </div>
              }
              {this.state.leftModelId && this.state.rightModelId && this.state.name &&
              <div className={classes.container}>
                <div className={classes.additionalInfo}>
                  <div
                    className={classnames(classes.tabbutton, this.state.showExplanation ? classes.active : '')}
                    onClick={() => this.setState({showExplanation: true} as State)}
                  >
                    <Help
                      size={12}
                      text={'These sentences express your specified schema in natural language.'}
                      placement={'left'}
                    />
                    <div className={classes.tabheader}>
                      Relation Explanation
                    </div>
                  </div>
                  <div
                    className={classnames(classes.tabbutton, !this.state.showExplanation ? classes.active : '')}
                    onClick={() => this.setState({showExplanation: false} as State)}
                  >
                    <Help
                      size={12}
                      text={'There are the mutations that your relation schema would generate'}
                      placement={'top'}
                    />
                    <div className={classes.tabheader}>
                     Generated Mutations
                    </div>
                  </div>
                </div>
                <div className={classes.explanation}>
                  {this.state.showExplanation &&
                  <RelationExplanation
                    fieldOnLeftModelName={this.state.fieldOnLeftModelName}
                    fieldOnRightModelName={this.state.fieldOnRightModelName}
                    fieldOnLeftModelIsList={this.state.fieldOnLeftModelIsList}
                    fieldOnRightModelIsList={this.state.fieldOnRightModelIsList}
                    leftModelId={this.state.leftModelId}
                    rightModelId={this.state.rightModelId}
                    project={this.props.viewer.project}
                  />
                  }
                  {!this.state.showExplanation &&
                  <GeneratedMutations
                    models={models}
                    fieldOnLeftModelName={this.state.fieldOnLeftModelName}
                    fieldOnRightModelName={this.state.fieldOnRightModelName}
                    fieldOnLeftModelIsList={this.state.fieldOnLeftModelIsList}
                    fieldOnRightModelIsList={this.state.fieldOnRightModelIsList}
                    leftModelId={this.state.leftModelId}
                    rightModelId={this.state.rightModelId}
                    relationName={this.state.name}
                  />
                  }
                </div>
              </div>
              }
            </div>
          </div>
          <div className={classes.buttons}>
            <div onClick={this.close}>
              Cancel
            </div>
            <div className={classnames(classes.submit, this.isValid() ? classes.valid : '')} onClick={this.submit}>
              {this.props.viewer.relation ? 'Save' : 'Create'}
            </div>
          </div>
        </div>
      </Popup>
    )
  }

  private handleLeftModelIdChange = (id: string) => {
    this.setState({leftModelId: id} as State, this.prepopulateFields)
  }

  private handleRightModelIdChange = (id: string) => {
    this.setState({rightModelId: id} as State, this.prepopulateFields)
  }

  private prepopulateFields = () => {
    if (this.state.fieldsEdited || !this.state.leftModelId || !this.state.rightModelId) {
      return
    }

    const models = this.props.viewer.project.models.edges.map((edge) => edge.node)

    let leftFieldName = this.state.fieldOnLeftModelIsList
      ? getModelNamePlural(this.state.rightModelId, models)
      : getModelName(this.state.rightModelId, models)
    let rightFieldName = this.state.fieldOnRightModelIsList
      ? getModelNamePlural(this.state.leftModelId, models)
      : getModelName(this.state.leftModelId, models)

    this.setState({
      fieldOnLeftModelName: leftFieldName.toLowerCase(),
      fieldOnRightModelName: rightFieldName.toLowerCase(),
    } as State)
  }

  private close = () => {
    this.props.router.goBack()
  }

  private getNewRelationState = (): State => {

    let preselectedModelId = null

    const {leftModelName} = this.props.location.query
    if (leftModelName) {
      preselectedModelId = this.props.viewer.project.models.edges.map((edge) => edge.node)
        .find((node) => node.name === leftModelName).id
    }
    return {
      name: '',
      description: '',
      fieldOnLeftModelName: '',
      fieldOnRightModelName: leftModelName ? leftModelName.toLowerCase() : '',
      fieldOnLeftModelIsList: false,
      fieldOnRightModelIsList: false,
      leftModelId: preselectedModelId,
      rightModelId: null,
      alertHint: false,
      showExplanation: true,
      fieldsEdited: false,
    } as State
  }

  private getExistingRelationState = (): State => {
    const {relation} = this.props.viewer
    return {
      name: relation.name,
      description: relation.description,
      fieldOnLeftModelName: relation.fieldOnLeftModel.name,
      fieldOnRightModelName: relation.fieldOnRightModel.name,
      fieldOnLeftModelIsList: relation.fieldOnLeftModel.isList,
      fieldOnRightModelIsList: relation.fieldOnRightModel.isList,
      leftModelId: relation.leftModel.id,
      rightModelId: relation.rightModel.id,
      alertHint: false,
      showExplanation: true,
      fieldsEdited: true,
    } as State
  }

  private isValid = (): boolean => {
    const {name, fieldOnLeftModelName, fieldOnRightModelName, leftModelId, rightModelId} = this.state

    const nameIsValid = validateModelName(name)
    const fieldNamesAreValid = validateFieldName(fieldOnLeftModelName) && validateFieldName(fieldOnRightModelName)
    const modelsAreSelected = leftModelId !== null && rightModelId !== null

    return nameIsValid && fieldNamesAreValid && modelsAreSelected
  }

  private submit = (): void => {
    if (this.props.viewer.relation) {
      this.update()
    } else {
      this.create()
    }
  }

  private create = (): void => {
    if (!this.isValid()) {
      return
    }

    if (this.props.viewer.project.id === null) {
      return
    }

    Relay.Store.commitUpdate(
      new AddRelationMutation({
        projectId: this.props.viewer.project.id,
        name: this.state.name,
        description: this.state.description === '' ? null : this.state.description,
        leftModelId: this.state.leftModelId,
        rightModelId: this.state.rightModelId,
        fieldOnLeftModelName: this.state.fieldOnLeftModelName,
        fieldOnRightModelName: this.state.fieldOnRightModelName,
        fieldOnLeftModelIsList: this.state.fieldOnLeftModelIsList,
        fieldOnRightModelIsList: this.state.fieldOnRightModelIsList,
      }),
      {
        onSuccess: () => {
          this.close()
        },
        onFailure: (transaction: Transaction) => onFailureShowNotification(transaction, this.props.showNotification),
      }
    )
  }

  private update = (): void => {
    if (!this.isValid()) {
      return
    }

    if (this.props.viewer.relation === null) {
      return
    }

    Relay.Store.commitUpdate(
      new UpdateRelationMutation({
        relationId: this.props.viewer.relation.id,
        name: this.state.name,
        description: this.state.description === '' ? null : this.state.description,
        leftModelId: this.state.leftModelId,
        rightModelId: this.state.rightModelId,
        fieldOnLeftModelName: this.state.fieldOnLeftModelName,
        fieldOnRightModelName: this.state.fieldOnRightModelName,
        fieldOnLeftModelIsList: this.state.fieldOnLeftModelIsList,
        fieldOnRightModelIsList: this.state.fieldOnRightModelIsList,
      }),
      {
        onSuccess: () => {
          // The force fetching because relations are too complicated to selective choose the config
          this.props.relay.forceFetch()
          this.close()
        },
        onFailure: (transaction: Transaction) => onFailureShowNotification(transaction, this.props.showNotification),
      }
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({showNotification}, dispatch)
}

const MappedRelationPopup = connect(null, mapDispatchToProps)(withRouter(RelationPopup))

export default Relay.createContainer(MappedRelationPopup, {
  initialVariables: {
    projectName: null, // injected from router
    relationName: null, // injected from router
    relationExists: false,
  },
  prepareVariables: (prevVariables: any) => (Object.assign({}, prevVariables, {
    relationExists: !!prevVariables.relationName,
  })),
    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
              relation: relationByName(
              projectName: $projectName
              relationName: $relationName
              ) @include(if: $relationExists) {
                id
                name
                description
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
                leftModel {
                  id
                  name
                }
                rightModel {
                  id
                  name
                }
              }
              project: projectByName(projectName: $projectName) {
                id
                ${RelationExplanation.getFragment('project')}
                models (first: 1000) {
                  edges {
                    node {
                      id
                      name
                      namePlural
                    }
                  }
                }
              }
            }
        `,
    },
})
