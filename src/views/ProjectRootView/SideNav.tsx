import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Relay from 'react-relay'
import {withRouter, Link} from 'react-router'
import {connect} from 'react-redux'
import cuid from 'cuid'
import {bindActionCreators} from 'redux'
import * as PureRenderMixin from 'react-addons-pure-render-mixin'
import mapProps from '../../components/MapProps/MapProps'
// import {validateModelName} from '../../utils/nameValidator'
import ScrollBox from '../../components/ScrollBox/ScrollBox'
import Tether from '../../components/Tether/Tether'
import AddModelMutation from '../../mutations/AddModelMutation'
import {sideNavSyncer} from '../../utils/sideNavSyncer'
import {onFailureShowNotification} from '../../utils/relay'
import {nextStep, showDonePopup} from '../../actions/gettingStarted'
import {showPopup} from '../../actions/popup'
import {Project, Viewer, Model} from '../../types/types'
import {ShowNotificationCallback} from '../../types/utils'
import {showNotification} from '../../actions/notification'
import {Popup} from '../../types/popup'
import {GettingStartedState} from '../../types/gettingStarted'
import EndpointPopup from './EndpointPopup'
import AddModelPopup from './AddModelPopup'
import styled from 'styled-components'
import * as cx from 'classnames'
import {particles, variables, Icon} from 'graphcool-styles'

interface Props {
  params: any
  project: Project
  projectCount: number
  viewer: Viewer
  relay: Relay.RelayProp
  models: Model[]
  gettingStartedState: GettingStartedState
  nextStep: () => Promise<any>
  skip: () => Promise<any>
  showNotification: ShowNotificationCallback
  router: ReactRouter.InjectedRouter
  showDonePopup: () => void
  showPopup: (popup: Popup) => void
}

interface State {
  forceShowModels: boolean
  addingNewModel: boolean
  newModelName: string
  newModelIsValid: boolean
  modelsExpanded: boolean
  modelsFit: boolean
}

// Section (Models, Relations, Permissions, etc.)

const Section = styled.div`
  padding: ${variables.size38} 0 0;
  
  &:last-child {
    margin-bottom: ${variables.size38}
  }
`

// Section Heads

const activeHead = `
  color: ${variables.white};
  
  svg {
    fill: ${variables.white};
    stroke: none !important;
  }
  
  &:hover {
    color: inherit;
    
    svg {
      fill: ${variables.white};
      stroke: none !important;
    }
  }
  
`

const Head = styled(Link)`
  letter-spacing: 1px;
  line-height: 1;
  padding: 0 ${variables.size25};
  display: flex;
  align-items: center;
  text-transform: uppercase;
  font-weight: 600;
  color: ${variables.white60};
  transition: color ${variables.duration} linear;
  
  &:hover {
    color: ${variables.white80};
    
    svg {
      fill: ${variables.white80};
      stroke: none !important;
    }
  }

  > div {
    line-height: 1;
    margin-left: ${variables.size10};
  }

  svg {
    fill: ${variables.white60};
    stroke: none !important;
    transition: fill ${variables.duration} linear;
  }
  
  ${props => props.active && activeHead}
`

const footerSectionStyle = `
  display: flex;
  align-items: center;
  padding: ${variables.size25};
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  color: ${variables.white60};
  cursor: pointer;
  transition: color ${variables.duration} linear;
  
  > div {
    margin-left: ${variables.size10};
  }
  
  svg {
    fill: ${variables.white60};
    transition: fill ${variables.duration} linear

  }
  
  &:hover {
    color: ${variables.white80};
    svg {
      fill: ${variables.white80};
    }
  }
`
const FooterSection = styled.div`${footerSectionStyle}`
const FooterLink = styled.a`${footerSectionStyle}`

export class SideNav extends React.Component<Props, State> {

  refs: {
    [key: string]: any;
    newModelInput: HTMLInputElement
  }

  shouldComponentUpdate: any

  constructor(props) {
    super(props)
    this.state = {
      forceShowModels: false,
      addingNewModel: false,
      newModelName: '',
      newModelIsValid: true,
      modelsExpanded: false,
      modelsFit: true,
    }
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
  }

  componentDidMount() {
    // subscribe to sideNavSyncer - THIS IS A HACK
    sideNavSyncer.setCallback(this.fetch, this)
    window.addEventListener('resize', this.setModelsFit)
  }

  componentWillUnmount() {
    // unsubscribe from sideNavSyncer - THIS IS A HACK
    sideNavSyncer.setCallback(null, null)
    window.removeEventListener('resize', this.setModelsFit)
  }

  render() {
    console.log(this.state.modelsFit)

    return (
      <div
        className={cx(
          particles.relative,
          particles.w100,
          particles.h100,
          particles.white,
          particles.bgDarkBlue,
          particles.f14,
        )}
        onMouseLeave={() => this.setState({forceShowModels: false} as State)}>
        <div className={cx(particles.h100)} style={{ paddingBottom: '70px' }}>
          <ScrollBox>
            {this.renderModels()}
            {this.renderRelations()}
            {this.renderPermissions()}
            {this.renderActions()}
            {this.renderPlayground()}
          </ScrollBox>
        </div>
        <div
          className={cx(
            particles.absolute,
            particles.w100,
            particles.bottom0,
            particles.flex,
            particles.itemsCenter,
            particles.justifyBetween,
            particles.bgDarkerBlue,
            particles.white60,
          )}
          style={{ height: '70px' }}
        >
          <FooterSection>
            <Icon width={20} height={20} src={require('graphcool-styles/icons/fill/endpoints.svg')}/>
            <div onClick={this.showEndpointPopup}>Endpoints</div>
          </FooterSection>
          <FooterLink href='https://docs.graph.cool' target='_blank'>
            <Icon width={20} height={20} src={require('graphcool-styles/icons/fill/docs.svg')}/>
            <div>Docs</div>
          </FooterLink>
        </div>
      </div>
    )
  }

  private renderPlayground = () => {
    const playgroundPageActive = this.props.router.isActive(`/${this.props.params.projectName}/playground`)
    const showGettingStartedOnboardingPopup = () => {
      if (this.props.gettingStartedState.isCurrentStep('STEP4_CLICK_PLAYGROUND')) {
        this.props.nextStep()
      }
    }

    return (
      <Section>
        <Head
          to={`/${this.props.params.projectName}/playground`}
          active={playgroundPageActive}
          onClick={showGettingStartedOnboardingPopup}
        >
          <Icon
            width={20}
            height={20}
            src={require('graphcool-styles/icons/fill/playground.svg')}
          />
          <Tether
            side='top'
            steps={[{
                step: 'STEP4_CLICK_PLAYGROUND',
                title: 'Open the Playground',
                description: 'Now that we have defined our data model and added example data it\'s time to send some queries to our backend!', // tslint:disable-line
              }]}
            offsetY={this.state.addingNewModel ? -75 : -5}
            width={280}
          >
            <div>Playground</div>
          </Tether>
        </Head>
      </Section>
    )
  }

  private renderActions = () => {
    const actionsPageActive = this.props.router.isActive(`/${this.props.params.projectName}/actions`)
    return (
      <Section>
        <Head
          to={`/${this.props.params.projectName}/actions`}
          active={actionsPageActive}
        >
          <Icon width={20} height={20} src={require('graphcool-styles/icons/fill/actions.svg')}/>
          <div>Actions</div>
        </Head>
      </Section>
    )
  }

  private renderPermissions = () => {
    const permissionsPageActive = this.props.router.isActive(`/${this.props.params.projectName}/permissions`)
    return (
      <Section>
        <Head
          to={`/${this.props.params.projectName}/permissions`}
          active={permissionsPageActive}
        >
          <Icon width={20} height={20} src={require('graphcool-styles/icons/fill/permissions.svg')}/>
          <div>Permissions</div>
        </Head>
      </Section>
    )
  }

  private renderRelations = () => {
    const relationsPageActive = this.props.router.isActive(`/${this.props.params.projectName}/relations`)

    const activeRelationsHead = `
      svg {
        fill: none;
        stroke: ${variables.white} !important;
      }
      
      &:hover {
        svg {
          stroke: ${variables.white} !important;
        }
      }
    `

    const RelationsHead = styled(Head)`
      svg {
        fill: none;
        stroke: ${variables.white60} !important;
        stroke-width: 4px !important;
        transition: stroke ${variables.duration} linear;
      }
      
      &:hover {
        svg {
          fill: none;
          stroke: ${variables.white80} !important;
        }
      }
      
      ${props => props.active && activeRelationsHead}
    `

    return (
      <Section>
        <RelationsHead
          to={`/${this.props.params.projectName}/relations`}
          active={relationsPageActive}
        >
          <Icon width={20} height={20} stroke src={require('graphcool-styles/icons/stroke/relationsSmall.svg')}/>
          <div>Relations</div>
        </RelationsHead>
      </Section>
    )
  }

  private setModelsFit = () => {
    const HEADER_HEIGHT = 64
    const FOOTER_HEIGHT = 70

    const MODEL_MARGIN_TOP = 68
    const MODEL_HEIGHT = 36
    const numModels = this.props.models.length
    const MODEL_MARGIN_BOTTOM = 38

    const NUM_LINKS = 4
    const LINK_HEIGHT = 58
    const LINKS_MARGIN = 38

    const height = window.innerHeight

    const fit = height > (
      HEADER_HEIGHT +
      FOOTER_HEIGHT +
      MODEL_MARGIN_TOP +
      MODEL_HEIGHT * numModels +
      MODEL_MARGIN_BOTTOM +
      NUM_LINKS * LINK_HEIGHT +
      LINKS_MARGIN
    )

    this.setState({modelsFit: fit} as State)
  }

  private renderModels = () => {
    const modelActive = (model) => (
      this.props.router.isActive(`/${this.props.params.projectName}/models/${model.name}/structure`) ||
      this.props.router.isActive(`/${this.props.params.projectName}/models/${model.name}/browser`)
    )

    // const modelsPageActive = this.props.router.isActive(`/${this.props.params.projectName}/models`)
    // const showsModels = modelsPageActive || this.state.forceShowModels

    const ModelsHead = styled(Head)`
      &:hover {
        color: ${variables.white60};
        cursor: default;
      }
    `

    const AddModel = styled.div`
      margin: -3px -4px 0 0;
    
      svg {
        stroke: ${variables.white};
        stroke-width: 4px;
      }
    `

    const turnedToggleMore = `
      i {
        transform: rotate(180deg) !important;
        svg {
          position: relative;
          top: 1px;
        }
      }
    `

    const ToggleMore = styled.div`
      height: ${variables.size60};
      background: linear-gradient(to bottom, ${variables.darkerBlue0} 0%, ${variables.darkerBlue} 80%);
      
      svg {
        stroke-width: 4px;
        fill: none;
      }
      
      ${props => props.turned && turnedToggleMore}
    `

    const activeListElement = `
      color: ${variables.white} !important;
      background: ${variables.white07};
      cursor: default;

      &:before {
        content: "";
        position: absolute;
        top: -1px;
        bottom: -1px;
        left: 0;
        width: ${variables.size06};
        background: ${variables.green};
        border-radius: 0 2px 2px 0;
      }
      
      &:hover {
        color: inherit;
      }
    `
    const ListElement = styled(Link)`
      transition: color ${variables.duration} linear;

      &:hover {
         color: ${variables.white60};
      }
      
      ${props => props.active && activeListElement}
    `

    return (
      <Section className={cx(
        particles.relative,
        particles.bgDarkerBlue,
      )}>
        <ModelsHead to={`/${this.props.params.projectName}/models`}>
          Models
        </ModelsHead>
        <div className={cx(particles.overflowHidden)} style={{
          height: this.state.modelsFit ? 'auto' : (this.state.modelsExpanded ? 74 + 36 * this.props.models.length : window.innerHeight - 456),
          transition: 'height .5s ease',
        }}>
          <div className={cx(
            particles.flex,
            particles.flexColumn,
            particles.pt16,
            this.state.modelsFit ? particles.pb38 : particles.pb60
          )}>
            {this.props.models && this.props.models.map((model) => (
              <ListElement
                key={model.name}
                to={`/${this.props.params.projectName}/models/${model.name}`}
                active={modelActive(model)}
                className={cx(
                particles.relative,
                particles.pv10,
                particles.fw6,
                particles.white30,
                particles.ph25,
                particles.flex,
                particles.justifyBetween,
              )}>
                <div className={cx(particles.pl6)}>{model.name}</div>
                <div>{model.itemCount}</div>
              </ListElement>
            ))}
          </div>

        </div>

        <AddModel
          className={cx(
            particles.absolute,
            particles.top38,
            particles.right25,
            particles.lhSolid,
            particles.ba,
            particles.brPill,
            particles.bWhite,
            particles.pointer,
            particles.o60
           )}
          onClick={this.showAddModelPopup}
        >
          <Tether
            steps={[{
              step: 'STEP1_CREATE_POST_MODEL',
              title: 'Create a "Post" Model',
              description: 'Models represent a certain type of data. To manage our Instagram posts, the "Post" model will have an image URL and a description.', // tslint:disable-line
            }]}
            offsetY={this.state.addingNewModel ? -75 : -5}
            width={350}
          >
            <Icon width={18} height={18} stroke src={require('graphcool-styles/icons/stroke/add.svg')}/>
          </Tether>
        </AddModel>
        {!this.state.modelsFit &&
          <ToggleMore
            onClick={() => this.setState({modelsExpanded: !this.state.modelsExpanded} as State )}
            className={cx(
              particles.absolute,
              particles.bottom0,
              particles.left0,
              particles.w100,
              particles.flex,
              particles.justifyCenter,
              particles.itemsCenter,
              particles.pointer,
            )}
            turned={this.state.modelsExpanded}
          >
            <Icon
              width={18}
              height={18}
              stroke
              color={variables.white}
              src={require('graphcool-styles/icons/stroke/arrowDown.svg')}
              onClick={this.toggleModels}
              className={cx(
                particles.brPill,
                particles.bgDarkBlue
              )}
            />
          </ToggleMore>
        }
      </Section>
    )
  }

  // private handleNewModelChange = (e) => {
  //   this.setState({
  //     newModelName: e.target.value,
  //     newModelIsValid: e.target.value === '' ? true : validateModelName(e.target.value),
  //   } as State)
  // }
  //
  // private handleNewModelKeyDown = (e) => {
  //   if (e.keyCode === 13) {
  //     this.addModel()
  //   }
  // }

  private toggleModels = () => {
    const { modelsExpanded } = this.state
    this.setState({modelsExpanded: !modelsExpanded} as State)
  }

  private fetch = () => {
    // the backend might cache the force fetch requests, resulting in potentially inconsistent responses
    this.props.relay.forceFetch()
  }

  private toggleAddModelInput = () => {
    if (this.state.addingNewModel && this.state.newModelIsValid) {
      this.addModel()
    }

    this.setState(
      {
        addingNewModel: !this.state.addingNewModel,
      } as State,
      () => {
        if (this.state.addingNewModel) {
          ReactDOM.findDOMNode<HTMLInputElement>(this.refs.newModelInput).focus()
        }
      }
    )
  }

  private addModel = () => {
    const redirect = () => {
      this.props.router.push(`/${this.props.params.projectName}/models/${this.state.newModelName}`)
      this.setState({
        addingNewModel: false,
        newModelIsValid: true,
        newModelName: '',
      } as State)
    }

    if (this.state.newModelName) {
      Relay.Store.commitUpdate(
        new AddModelMutation({
          modelName: this.state.newModelName,
          projectId: this.props.project.id,
        }),
        {
          onSuccess: () => {
            analytics.track('sidenav: created model', {
              project: this.props.params.projectName,
              model: this.state.newModelName,
            })
            // getting-started onboarding step
            if (
              this.state.newModelName === 'Post' &&
              this.props.gettingStartedState.isCurrentStep('STEP1_CREATE_POST_MODEL')
            ) {
              this.props.showDonePopup()
              this.props.nextStep().then(redirect)
            } else {
              redirect()
            }
          },
          onFailure: (transaction) => {
            onFailureShowNotification(transaction, this.props.showNotification)
          },
        }
      )
    }
  }

  private showEndpointPopup = () => {
    const id = cuid()
    this.props.showPopup({
      element: <EndpointPopup id={id}/>,
      id,
    })
  }

  private showAddModelPopup = () => {
    const id = cuid()
    this.props.showPopup({
      element: <AddModelPopup id={id}/>,
      id,
    })
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({nextStep, showDonePopup, showNotification, showPopup}, dispatch)
}

const ReduxContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(SideNav))

const MappedSideNav = mapProps({
  params: (props) => props.params,
  project: (props) => props.project,
  relay: (props) => props.relay,
  models: (props) => props.project.models.edges
    .map((edge) => edge.node)
    .sort((a, b) => a.name.localeCompare(b.name)),
})(ReduxContainer)

export default Relay.createContainer(MappedSideNav, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          id
        }
      }
    `,
    project: () => Relay.QL`
      fragment on Project {
        id
        name
        webhookUrl
        models(first: 100) {
          edges {
            node {
              id
              name
              itemCount
            }
          }
        }
      }
    `,
  },
})
