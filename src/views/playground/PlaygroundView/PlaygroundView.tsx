import * as React from 'react'
import * as Relay from 'react-relay'
import Helmet from 'react-helmet'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'
import GraphiQL from 'graphiql'
import { Viewer, User, Project } from '../../../types/types'
import { saveQuery } from '../../../utils/QueryHistoryStorage'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {showPopup} from '../../../actions/popup'
import QueryHistory from '../../../components/QueryHistory/QueryHistory'
import Header from '../../../components/Header/Header'
import Icon from '../../../components/Icon/Icon'
import * as cookiestore from 'cookiestore'
import endpoints from '../../../utils/endpoints'
import { sideNavSyncer } from '../../../utils/sideNavSyncer'
import LoginClientUserMutation from '../../../mutations/LoginClientUserMutation'
import {GettingStartedState} from '../../../types/gettingStarted'
import cuid from 'cuid'
const classes: any = require('./PlaygroundView.scss')

require('graphiql/graphiql.css')

const DASHBOARD_ADMIN = {
  id: '0',
  email: 'ADMIN',
  roles: null,
}

const DEFAULT_QUERY = `{
  allUsers {
    id
    email
  }
}`

type Endpoint = 'SIMPLE' | 'RELAY'

interface Props {
  viewer: Viewer & { project: Project }
  params: any
  showPopup: any
  gettingStartedState: GettingStartedState
}

interface State {
  users: User[]
  historyVisible: boolean
  query: string | undefined
  variables: string | undefined
  selectedEndpoint: Endpoint
  selectedUserId: string
  selectedUserToken: string
  adminToken: string
}

class PlaygroundView extends React.Component<Props, State> {

  private lokka: any

  constructor (props) {
    super(props)

    const clientEndpoint = `${__BACKEND_ADDR__}/relay/v1/${this.props.viewer.project.id}`
    const token = cookiestore.get('graphcool_auth_token')
    const headers = { Authorization: `Bearer ${token}`, 'X-GraphCool-Source': 'dashboard:playground' }
    const transport = new Transport(clientEndpoint, { headers })

    this.lokka = new Lokka({ transport })

    this.state = {
      users: [DASHBOARD_ADMIN],
      historyVisible: false,
      query: window.localStorage.getItem(`used-playground-${this.props.viewer.project.id}`) ? undefined : DEFAULT_QUERY,
      variables: undefined,
      selectedEndpoint: (window.localStorage.getItem('SELECTED_ENDPOINT') || 'SIMPLE') as Endpoint,
      selectedUserId: DASHBOARD_ADMIN.id,
      selectedUserToken: null,
      adminToken: token,
    }
  }

  componentWillMount () {
    const query = `
      {
        viewer {
          allUsers {
            edges {
              node {
                id
                email
                roles
              }
            }
          }
        }
      }
    `
    this.lokka.query(query)
      .then((results) => {
        const users = results.viewer.allUsers.edges.map((edge) => edge.node)
        this.setState({ users: [DASHBOARD_ADMIN, ...users] } as State)
      })
  }

  componentDidMount () {
    analytics.track('playground: viewed', {
      project: this.props.params.projectName,
    })

    // TODO: Change here
    if (this.props.gettingStartedState.isCurrentStep('STEP1_OVERVIEW')) {
      const id = cuid()
      this.props.showPopup(<div></div>, id)
    }
  }

  render () {
    const fetcher = (graphQLParams) => (
      fetch(`${__BACKEND_ADDR__}/${endpoints[this.state.selectedEndpoint].alias}/${this.props.viewer.project.id}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.state.selectedUserToken || this.state.adminToken}`,
          'X-GraphCool-Source': 'dashboard:playground',
        },
        body: JSON.stringify(graphQLParams),
      })
      .then((response) => {
        // exclude IntrospectionQuery
        if (response.ok && !graphQLParams.query.includes('IntrospectionQuery')) {
          analytics.track('playground: run', {
            project: this.props.params.projectName,
            endpoint: this.state.selectedEndpoint,
          })

          // save query for query history
          const query = {
            query: graphQLParams.query,
            variables: graphQLParams.variables,
            date: new Date(),
          }
          saveQuery(query, this.props.viewer.project.id)
        }

        if (graphQLParams.query.includes('mutation')) {
          // update side nav item count when we did a mutation
          sideNavSyncer.notifySideNav()
        }

        return response.json()
      })
    )

    return (
      <div className={classes.root}>
        <Helmet title='Playground' />
        <Header
          viewer={this.props.viewer}
          params={this.props.params}
          project={this.props.viewer.project}
        >
          <div>Playground</div>
        </Header>
        <div className={classes.head}>
          <div
            className={classes.history}
            onClick={() => this.setState({ historyVisible: !this.state.historyVisible } as State)}
            >
            {this.state.historyVisible &&
              <div className={classes.historyOverlay}>
                <QueryHistory
                  projectId={this.props.viewer.project.id}
                  onQuerySelect={this.onHistoryQuerySelect}
                  />
              </div>
            }
            <Icon
              src={require(`assets/icons/${this.state.historyVisible ? 'close' : 'history'}.svg`)}
              width={20}
              height={20}
              />
            <span>{this.state.historyVisible ? 'Close' : 'History'}</span>

          </div>
          <div className={classes.endpoint}>
            <select onChange={this.changeEndpoint} value={this.state.selectedEndpoint}>
              {Object.keys(endpoints).map((endpoint) => (
                <option key={endpoint} value={endpoint}>{endpoints[endpoint].title}</option>
              ))}
            </select>
          </div>
          <div className={classes.user}>
            <select value={this.state.selectedUserId} onChange={this.changeUser}>
              {this.state.users.map((user) => {
                const rolesStr = user.roles ? `(${user.roles.join(', ')})` : ''
                return (
                  <option key={user.id} value={user.id}>
                    {user.email} {rolesStr}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
        <div className={classes.graphiql}>
          <GraphiQL
            key={this.state.selectedEndpoint}
            fetcher={fetcher}
            query={this.state.query}
            variables={this.state.variables || ''}
            onEditQuery={this.rememberPlaygroundUsed}
            />
        </div>
      </div>
    )
  }

  private onHistoryQuerySelect = (query) => {
    if (query) {
      this.setState({
        query: query.query,
        variables: query.variables,
      } as State)
    }

    this.setState({ historyVisible: false } as State)
  }

  private changeEndpoint = (e) => {
    const selectedEndpoint = e.target.value
    this.setState({ selectedEndpoint } as State)
    window.localStorage.setItem('SELECTED_ENDPOINT', selectedEndpoint)

    analytics.track('playground: endpoint changed', {
      project: this.props.params.projectName,
      endpoint: selectedEndpoint,
    })
  }

  private changeUser = (e) => {
    const selectedUserId = e.target.value

    if (selectedUserId === DASHBOARD_ADMIN.id) {
      this.setState({ selectedUserId, selectedUserToken: null } as State)
    } else {
      Relay.Store.commitUpdate(
        new LoginClientUserMutation({
          clientUserId: selectedUserId,
          projectId: this.props.viewer.project.id,
        }),
        {
          onSuccess: (response) => {
            this.setState({
              selectedUserId,
              selectedUserToken: response.signinClientUser.token,
            } as State)

            analytics.track('playground: user changed', {
              project: this.props.params.projectName,
              userId: selectedUserId,
            })
          },
          onFailure: (transaction) => {
            alert(transaction.getError())
          },
        }
      )
    }
  }

  private rememberPlaygroundUsed = () => {
    window.localStorage.setItem(`used-playground-${this.props.viewer.project.id}`, 'true')
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ showPopup }, dispatch)
}

const MappedPlaygroudView = connect(mapStateToProps, mapDispatchToProps)(PlaygroundView)

export default Relay.createContainer(MappedPlaygroudView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          id
          ${Header.getFragment('project')}
        }
        ${Header.getFragment('viewer')}
      }
    `,
  },
})
