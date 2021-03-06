import * as React from 'react'
import * as Relay from 'react-relay'
import {withRouter} from 'react-router'
import Helmet from 'react-helmet'
import mapProps from '../../components/MapProps/MapProps'
import {Model} from '../../types/types'

interface Props {
  params: any
  model?: Model
  router: ReactRouter.InjectedRouter
}

class ModelRedirectView extends React.Component<Props, {}> {

  componentWillMount() {
    if (!this.props.model) {
      // redirect to project root, as this was probably a non-existing model
      this.props.router.replace(`/${this.props.params.projectName}/models`)
    } else {
      // redirect to browser if model already has nodes
      const subView = this.props.model.itemCount === 0 ? 'structure' : 'browser'
      this.props.router.replace(`/${this.props.params.projectName}/models/${this.props.model.name}/${subView}`)
    }
  }

  render() {
    return (
      <div>
        <Helmet title={this.props.model.name}/>
        Redirecting...
      </div>
    )
  }
}

const MappedModelRedirectView = mapProps({
  params: (props) => props.params,
  model: (props) => (
    props.params.modelName
      ? props.viewer.project.models.edges
      .map(({node}) => node)
      .find((m) => m.name === props.params.modelName)
      : props.viewer.project.models.edges
      .map(({node}) => node)
      .sort((a, b) => a.name.localeCompare(b.name))[0]
  ),
})(withRouter(ModelRedirectView))

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
