import * as React from 'react'
import {withRouter} from 'react-router'
import {Model} from '../../types/types'
import Icon from '../../components/Icon/Icon'
import {classnames} from '../../utils/classnames'
const classes: any = require('./RelationModels.scss')

interface Props {
  leftModel: Model
  leftModelIsList: boolean
  rightModel: Model
  rightModelIsList: boolean
  projectName: string
  router: any
}

class RelationModels extends React.Component<Props,{}> {

  render() {
    return (
      <span>
        <span
          className={classnames(classes.model, this.props.rightModelIsList ? classes.isMany : '')}
          onClick={(e) => this.handleClick(e, this.props.leftModel.name)}
        >
          <span className={classes.modelContainer}>
            {this.props.leftModel.name}
          </span>
        </span>
        <span className={classes.iconContainer}>
          <Icon
            className={classes.icon}
            width={18}
            src={require('assets/new_icons/bidirectional.svg')}
          />
        </span>
        <span
          className={classnames(classes.model, this.props.leftModelIsList ? classes.isMany : '')}
          onClick={(e) => this.handleClick(e, this.props.rightModel.name)}
        >
          <span className={classes.modelContainer}>
          {this.props.rightModel.name}
          </span>
        </span>
      </span>
    )
  }

  private handleClick = (e: any, modelName: string) => {
    e.preventDefault()
    e.stopPropagation()
    this.props.router.push(`/${this.props.projectName}/models/${modelName}`)
  }
}

export default withRouter(RelationModels)
