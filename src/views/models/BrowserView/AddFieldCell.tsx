import * as React from 'react'
import { Link } from 'react-router'
const classes: any = require('./AddFieldCell.scss')

interface Props {
  params: any
}

export default class AddFieldCell extends React.Component<Props, {}> {

  render () {
    return (
      <div className={classes.root}>
        <Link
          to={`/${this.props.params.projectName}/models/${this.props.params.modelName}/structure/create`}
        >
          Add Field
        </Link>
      </div>
    )
  }
}
