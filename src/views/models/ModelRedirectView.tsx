import * as React from 'react'
import * as Relay from 'react-relay'
import Helmet from 'react-helmet'
import mapProps from '../../components/MapProps/MapProps'
import { connect } from 'react-redux'
import { Model } from '../../types/types'

interface Props {
  params: any
  gettingStartedState: any
  model?: Model
}

class ModelRedirectView extends React.Component<Props, {}> {

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  context: {
    router: any
  }

  componentWillMount () {
    if (this.props.gettingStartedState.isCurrentStep('STEP1_OVERVIEW')) {
      // redirect to getting started
      this.context.router.replace(`/${this.props.params.projectName}/getting-started`)
    } else if (!this.props.model) {
      // redirect to project root, as this was probably a non-existing model
      this.context.router.replace(`/${this.props.params.projectName}/models`)
    } else {
      // redirect to browser if model already has nodes
      const subView = this.props.model.itemCount === 0 ? 'structure' : 'browser'
      this.context.router.replace(`/${this.props.params.projectName}/models/${this.props.model.name}/${subView}`)
    }
  }

  render () {
    return (
      <div>
        <Helmet title={this.props.model.name} />
        Redirecting...
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

const ReduxContainer = connect(
  mapStateToProps,
)(ModelRedirectView)

const MappedModelRedirectView = mapProps({
  params: (props) => props.params,
  model: (props) => (
    props.params.modelName
      ? props.viewer.project.models.edges
          .map(({ node }) => node)
          .find((m) => m.name === props.params.modelName)
      : props.viewer.project.models.edges
          .map(({ node }) => node)
          .sort((a, b) => a.name.localeCompare(b.name))[0]
  ),
})(ReduxContainer)

export default Relay.createContainer(MappedModelRedirectView, {
  initialVariables: {
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        project: projectByName(projectName: $projectName) {
          models(first: 100) {
            edges {
              node {
                name
                itemCount
              }
            }
          }
        }
      }
    `,
  },
})
