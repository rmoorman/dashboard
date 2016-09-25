import * as React from 'react'
import * as Relay from 'react-relay'
import {withRouter} from 'react-router'
import calculateSize from 'calculate-size'
import * as Immutable from 'immutable'
import * as PureRenderMixin from 'react-addons-pure-render-mixin'
import Icon from '../../../components/Icon/Icon'
import mapProps from '../../../components/MapProps/MapProps'
import Loading from '../../../components/Loading/Loading'
import {showNotification} from '../../../actions/notification'
import {ShowNotificationCallback, TypedValue} from '../../../types/utils'
import {getFieldTypeName, stringToValue} from '../../../utils/valueparser'
import Tether from '../../../components/Tether/Tether'
import NewRow from './NewRow'
import HeaderCell from './HeaderCell'
import AddFieldCell from './AddFieldCell'
import CheckboxCell from './CheckboxCell'
import {emptyDefault, getFirstInputFieldIndex, getDefaultFieldValues} from '../utils'
import {valueToString} from '../../../utils/valueparser'
import {isNonScalarList} from '../../../utils/graphql'
import {sideNavSyncer} from '../../../utils/sideNavSyncer'
import {Field, Model, Viewer, Project, OrderBy} from '../../../types/types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import ModelHeader from '../ModelHeader'
import {nextStep} from '../../../actions/gettingStarted'
import {GettingStartedState} from '../../../types/gettingStarted'
import {showPopup, closePopup} from '../../../actions/popup'
import InfiniteTable from '../../../components/InfiniteTable/InfiniteTable'
import {AutoSizer} from 'react-virtualized'
import Cell from './Cell'
import LoadingCell from './LoadingCell'
import {getLokka, addNode, addNodes, updateNode, deleteNode, queryNodes} from './../../../utils/relay'
import ProgressIndicator from '../../../components/ProgressIndicator/ProgressIndicator'
import {startProgress, incrementProgress} from '../../../actions/progressIndicator'
import cuid from 'cuid'
const classes: any = require('./BrowserView.scss')

interface Props {
  viewer: Viewer
  router: any
  route: any
  params: any
  fields: Field[]
  project: Project
  model: Model
  gettingStartedState: GettingStartedState
  showNotification: ShowNotificationCallback
  nextStep: () => void
  startProgress: () => any
  incrementProgress: () => any
  showPopup: (content: JSX.Element, id: string) => any
  closePopup: (id: string) => any
}

interface State {
  nodes: Immutable.List<Immutable.Map<string, any>>
  loading: boolean
  orderBy: OrderBy
  filter: Immutable.Map<string, any>
  filtersVisible: boolean
  newRowVisible: boolean
  selectedNodeIds: Immutable.List<string>
  itemCount: number
  loaded: Immutable.List<boolean>
  scrollTop: number
}

class BrowserView extends React.Component<Props, State> {

  shouldComponentUpdate: any

  private lokka: any

  constructor(props: Props) {
    super(props)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)

    this.lokka = getLokka(this.props.project.id)

    this.state = {
      nodes: Immutable.List<Immutable.Map<string, any>>(),
      loading: true,
      orderBy: {
        fieldName: 'id',
        order: 'DESC',
      },
      filter: Immutable.Map<string, any>(),
      filtersVisible: false,
      newRowVisible: false,
      selectedNodeIds: Immutable.List<string>(),
      itemCount: this.props.model.itemCount,
      loaded: Immutable.List<boolean>(),
      scrollTop: 0,
    }
  }

  componentWillMount = () => {
    this.reloadData()
  }

  componentDidMount = () => {
    analytics.track('models/browser: viewed', {
      model: this.props.params.modelName,
    })

    this.props.router.setRouteLeaveHook(this.props.route, () => {
      if (this.state.newRowVisible) {
        // TODO with custom dialogs use "return false" and display custom dialog
        return 'Are you sure you want to discard unsaved changes?'
      }
    })
  }

  render() {
    return (
      <div className={`${classes.root} ${this.state.filtersVisible ? classes.filtersVisible : ''}`}>
        <ModelHeader
          params={this.props.params}
          model={this.props.model}
          viewer={this.props.viewer}
          project={this.props.project}
        >
          <input type='file' onChange={this.handleImport} id='fileselector' className='dn' />
          <label htmlFor='fileselector' className={classes.button}>
            Import JSON
          </label>
          {this.renderTether()}
          {this.state.selectedNodeIds.size > 0 &&
          <div className={`${classes.button} ${classes.red}`} onClick={this.deleteSelectedNodes}>
            <Icon
              width={16}
              height={16}
              src={require('assets/icons/delete.svg')}
            />
            <span>Delete Selected ({this.state.selectedNodeIds.size})</span>
          </div>
          }
          <div
            className={`${classes.button} ${this.state.filtersVisible ? classes.blue : ''}`}
            onClick={() => this.setState({ filtersVisible: !this.state.filtersVisible } as State)}
          >
            <Icon
              width={16}
              height={16}
              src={require('assets/icons/search.svg')}
            />
          </div>
          <div className={classes.button} onClick={() => this.reloadData(Math.floor(this.state.scrollTop / 47))}>
            <Icon
              width={16}
              height={16}
              src={require('assets/icons/refresh.svg')}
            />
          </div>
        </ModelHeader>
        {this.state.loading &&
        <div className={classes.loadingOverlay}>
          <Loading color='#B9B9C8'/>
        </div>
        }
        <div className={`${classes.table} ${this.state.loading ? classes.loading : ''}`}>
          <div className={classes.tableContainer} style={{ width: '100%' }}>
            <AutoSizer>
              {({width, height}) => {
                const fieldColumnWidths = this.calculateFieldColumnWidths(width)
                if (this.state.loading) {
                  return
                }
                return (
                  <InfiniteTable
                    loadedList={this.state.loaded}
                    minimumBatchSize={50}
                    width={this.props.fields.reduce((sum, {name}) => sum + fieldColumnWidths[name], 0) + 34 + 250}
                    height={height}
                    scrollTop={this.state.scrollTop}
                    columnCount={this.props.fields.length + 2}
                    columnWidth={(input) => this.getColumnWidth(fieldColumnWidths, input)}
                    loadMoreRows={(input) => this.loadData(input.startIndex)}
                    addNew={this.state.newRowVisible}
                    onScroll={(input) => this.setState({scrollTop: input.scrollTop} as State)}

                    headerHeight={74}
                    headerRenderer={this.headerRenderer}

                    rowCount={this.state.itemCount}
                    rowHeight={47}
                    cellRenderer={this.cellRenderer}
                    loadingCellRenderer={this.loadingCellRenderer}

                    addRowHeight={47}
                    addCellRenderer={() => this.addCellRenderer(fieldColumnWidths)}
                  />
                )
              }}
            </AutoSizer>
          </div>
        </div>
      </div>
    )
  }

  private renderTether = (): JSX.Element => {
    return (
      <Tether
        steps={[{
          step: 'STEP6_ADD_DATA_ITEM_1',
          title: `Add your first Post node to the database.`,
        }, {
          step: 'STEP7_ADD_DATA_ITEM_2',
          title: `Well done. Let's add another one.`,
        }]}
        offsetX={5}
        offsetY={5}
        width={260}
      >
        <div
          className={`${classes.button} ${this.state.newRowVisible ? '' : classes.green}`}
          onClick={this.handleAddNodeClick}
        >
          <Icon
            width={16}
            height={16}
            src={require(`assets/icons/${this.state.newRowVisible ? 'close' : 'add'}.svg`)}
          />
          <span>{this.state.newRowVisible ? 'Cancel' : 'Add node'}</span>
        </div>
      </Tether>
    )
  }

  private handleImport = (e: any) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = this.parseImport
    reader.readAsText(file)
  }

  private parseImport = (e: any) => {
    const data = JSON.parse(e.target.result)
    const values = []
    data.forEach(item => {
      const fieldValues = getDefaultFieldValues(this.props.model.fields.edges.map((edge) => edge.node))
      Object.keys(item).forEach((key) => fieldValues[key].value = item[key])
      values.push(fieldValues)
    })
    const promises = []
    const chunk = 10
    const id = cuid()
    this.props.startProgress()
    this.props.showPopup(<ProgressIndicator title='Importing' total={Math.floor(values.length / chunk)} />, id)
    for (let i = 0; i < Math.floor(values.length / chunk); i++) {
      promises.push(
        addNodes(this.lokka, this.props.params.modelName, values.slice(i * chunk, i * chunk + chunk))
          .then(() => this.props.incrementProgress())
      )
    }
    Promise.all(promises).then(() => this.reloadData(0)).then(() => this.props.closePopup(id))
  }

  private handleAddNodeClick = () => {
    if (getFirstInputFieldIndex(this.props.fields) !== null) {
      this.setState({ newRowVisible: !this.state.newRowVisible } as State)
    } else {
      const fieldValues = this.props.model.fields.edges
        .map((edge) => edge.node)
        .filter((f) => f.name !== 'id')
        .mapToObject(
          (field) => field.name,
          (field) => ({
            value: stringToValue(field.defaultValue, field) || emptyDefault(field),
            field: field,
          })
        )
      this.addNewNode(fieldValues)
    }
  }

  private addCellRenderer = (columnWidths) => {
    return (
      <NewRow
        model={this.props.model}
        projectId={this.props.project.id}
        columnWidths={columnWidths}
        add={this.addNewNode}
        cancel={() => this.setState({newRowVisible: false} as State)}
      />
    )
  }

  private loadingCellRenderer = ({rowIndex, columnIndex}) => {
    const backgroundColor = rowIndex % 2 === 0 ? '#FCFDFE' : '#FFF'
    if (columnIndex === 0) {
      return (
        <CheckboxCell
          backgroundColor={backgroundColor}
          onChange={undefined}
          disabled={true}
          checked={false}
          height={47}
        />
      )
    } else if (columnIndex === this.props.fields.length + 1) { // AddColumn
      return (
        <LoadingCell
          backgroundColor={backgroundColor}
          empty={true}
        />
      )
    } else {
      return (
        <LoadingCell
          backgroundColor={backgroundColor}
        />
      )
    }
  }

  private headerRenderer = ({columnIndex}): JSX.Element | string => {
    if (columnIndex === 0) {
      return (
        <CheckboxCell
          height={74}
          onChange={this.selectAllOnClick}
          checked={this.state.selectedNodeIds.size === this.state.nodes.size && this.state.nodes.size > 0}
          backgroundColor={'transparent'}
        />
      )
    } else if (columnIndex === this.props.fields.length + 1) {
      return <AddFieldCell params={this.props.params} />
    } else {
      const field = this.props.fields[columnIndex - 1]
      return (
        <HeaderCell
          key={field.id}
          field={field}
          sortOrder={this.state.orderBy.fieldName === field.name ? this.state.orderBy.order : null}
          toggleSortOrder={() => this.setSortOrder(field)}
          updateFilter={(value) => this.updateFilter(value, field)}
          filterVisible={this.state.filtersVisible}
          params={this.props.params}
        />
      )
    }
  }

  private cellRenderer = ({rowIndex, columnIndex}): JSX.Element | string => {
    const node = this.state.nodes.get(rowIndex)
    const nodeId = node.get('id')
    const field = this.props.fields[columnIndex - 1]
    const backgroundColor = rowIndex % 2 === 0 ? '#FCFDFE' : '#FFF'
    if (columnIndex === 0) {
      return (
        <CheckboxCell
          checked={this.isSelected(nodeId)}
          onChange={() => this.onSelectRow(nodeId)}
          height={47}
          backgroundColor={backgroundColor}
        />
      )
    } else if (columnIndex === this.props.fields.length + 1) { // AddColumn
      return (
        <LoadingCell
          backgroundColor={backgroundColor}
          empty={true}
        />
      )
    } else {
      const value = node.get(field.name)
      return (
        <Cell
          isSelected={this.state.selectedNodeIds.includes(nodeId)}
          backgroundColor={backgroundColor}
          field={field}
          value={value}
          projectId={this.props.project.id}
          update={(value, field, callback) => this.updateEditingNode(value, field, callback, nodeId, rowIndex)}
          reload={() => this.loadData(rowIndex, 1)}
          nodeId={nodeId}
        />
      )
    }
  }

  private getColumnWidth = (fieldColumnWidths, {index}): number => {
    if (index === 0)  { // Checkbox
      return 34
    }  else if (index === this.props.fields.length + 1) { // AddColumn
      return 250
    } else {
      return fieldColumnWidths[this.getFieldName(index - 1)]
    }
  }

  private getFieldName = (index: number): string => {
    return this.props.fields[index].name
  }

  private setSortOrder = (field: Field) => {
    const order = this.state.orderBy.fieldName === field.name
      ? (this.state.orderBy.order === 'ASC' ? 'DESC' : 'ASC')
      : 'ASC'

    this.setState(
      {
        orderBy: {
          fieldName: field.name,
          order,
        },
      } as State,
      this.reloadData
    )
  }

  private loadData = (skip: number, first: number = 50): Promise<Immutable.List<Immutable.Map<string, any>>> => {
    return queryNodes(this.lokka, this.props.model.namePlural, this.props.fields,
                      skip, first, this.state.filter, this.state.orderBy)
      .then(results => {
        const newNodes = results.viewer[`all${this.props.model.namePlural}`]
          .edges.map(({node}) => {
            // Transforms the relay query into something that the valueparser understands
            // Previously we used the simple API that's why this is necessary
            this.props.fields.filter((field) => isNonScalarList(field))
              .forEach(({name}) => node[name] = node[name].edges.map(({node}) => node))
            return node
        }).map(Immutable.Map)

        let nodes = this.state.nodes
        let loaded = this.state.loaded
        for (let index = 0; index < newNodes.length; index++) {
          nodes = nodes.set(skip + index, newNodes[index])
          loaded = loaded.set(skip + index, true)
        }

        this.setState({
          nodes: nodes,
          loading: false,
          loaded: loaded,
          itemCount: results.viewer[`all${this.props.model.namePlural}`].count,
        } as State)
        return nodes
      })
      .catch((err) => {
        throw err
      })
  }

  private reloadData = (index: number = 0) => {
    this.setState({
      nodes: Immutable.List<Immutable.Map<string, any>>(),
      loaded: Immutable.List<boolean>(),
    } as State)
    return this.loadData(index)
      .then((nodes) => {
        // _update side nav model node count
        // THIS IS A HACK
        sideNavSyncer.notifySideNav()
      })
  }

  private updateFilter = (value: TypedValue, field: Field) => {
    this.setState({filter: this.state.filter.set(field.name, value)} as State, this.reloadData)

    // TODO: select cut set of selected and filtered nodes
    this.setState({selectedNodeIds: Immutable.List()} as State)
  }

  private updateEditingNode = (value: TypedValue, field: Field, callback, nodeId: string, index: number) => {
    updateNode(this.lokka, this.props.params.modelName, value, field, nodeId)
      .then(() => this.setState({loaded: this.state.loaded.set(index, false)} as State))
      .then(() => this.loadData(index, 1))
      .then(() => {
        callback(true)
        analytics.track('models/browser: updated node', {
          project: this.props.params.projectName,
          model: this.props.params.modelName,
          field: field.name,
        })
      })
      .catch((err) => {
        callback(false)
        err.rawError.forEach((error) => this.props.showNotification({message: error.message, level: 'error'}))
      })
  }

  private addNewNode = (fieldValues: { [key: string]: any }): Promise<any> => {
    return addNode(this.lokka, this.props.params.modelName, fieldValues)
      .then(() => this.reloadData(0))
      .then(() => {
        this.setState({
          newRowVisible: false,
        } as State)
        analytics.track('models/browser: created node', {
          project: this.props.params.projectName,
          model: this.props.params.modelName,
        })

        // getting-started onboarding step
        if (this.props.params.modelName === 'Post' && (
            this.props.gettingStartedState.isCurrentStep('STEP3_CLICK_ADD_NODE1') ||
            this.props.gettingStartedState.isCurrentStep('STEP3_CLICK_ADD_NODE2')
          )) {
          this.props.nextStep()
        }
      })
      .catch((err) => {
        err.rawError.forEach(error => this.props.showNotification({message: error.message, level: 'error'}))
        this.setState({loading: false} as State)
      })
  }

  private calculateFieldColumnWidths = (width: number): any => {
    const cellFontOptions = {
      font: 'Open Sans',
      fontSize: '12px',
    }

    const headerFontOptions = {
      font: 'Open Sans',
      fontSize: '12px',
    }

    const widths = this.props.fields.mapToObject(
      (field) => field.name,
      (field) => {
         const cellWidths = this.state.nodes
          .filter(node => !!node)
          .map(node => node.get(field.name))
          .map(value => valueToString(value, field, false))
          .map(str => calculateSize(str, cellFontOptions).width + 41)
          .toArray()
        const headerWidth = calculateSize(`${field.name} ${getFieldTypeName(field)}`, headerFontOptions).width + 90

        const maxWidth = Math.max(...cellWidths, headerWidth)
        const lowerLimit = 150
        const upperLimit = 400

        return maxWidth > upperLimit ? upperLimit : (maxWidth < lowerLimit ? lowerLimit : maxWidth)
      }
    )

    const totalWidth = this.props.fields.reduce((sum, {name}) => sum + widths[name], 0)
    const fieldWidth = width - 34 - 250
    if (totalWidth < fieldWidth) {
      this.props.fields.forEach(({name}) => widths[name] = (widths[name] / totalWidth) * fieldWidth)
    }
    return widths
  }

  private onSelectRow = (nodeId: string) => {
    if (this.state.selectedNodeIds.includes(nodeId)) {
      this.setState({selectedNodeIds: this.state.selectedNodeIds.filter(id => id !== nodeId)} as State)
    } else {
      this.setState({selectedNodeIds: this.state.selectedNodeIds.push(nodeId)} as State)
    }
  }

  private isSelected = (nodeId: string): boolean => {
    return this.state.selectedNodeIds.indexOf(nodeId) > -1
  }

  private selectAllOnClick = (checked: boolean) => {
    if (checked) {
      const selectedNodeIds = this.state.nodes.map(node => node.get('id'))
      this.setState({selectedNodeIds: selectedNodeIds} as State)
    } else {
      this.setState({selectedNodeIds: Immutable.List()} as State)
    }
  }

  private deleteSelectedNodes = () => {
    if (confirm(`Do you really want to delete ${this.state.selectedNodeIds.size} node(s)?`)) {
      // only reload once after all the deletions

      Promise.all(this.state.selectedNodeIds.toArray()
        .map((nodeId) => deleteNode(this.lokka, this.props.params.modelName, nodeId)))
        .then(analytics.track('models/browser: deleted node', {
          project: this.props.params.projectName,
          model: this.props.params.modelName,
        }))
        .then(() => this.reloadData())
        .catch((err) => {
          err.rawError.forEach((error) => this.props.showNotification({message: error.message, level: 'error'}))
        })

      this.setState({selectedNodeIds: Immutable.List()} as State)
    }
  }
}

const mapStateToProps = (state) => {
  return {
    gettingStartedState: state.gettingStarted.gettingStartedState,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      nextStep,
      showPopup,
      closePopup,
      startProgress,
      incrementProgress,
      showNotification,
    },
    dispatch)
}

const ReduxContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BrowserView))

const MappedBrowserView = mapProps({
  params: (props) => props.params,
  fields: (props) => (
    props.viewer.model.fields.edges
      .map((edge) => edge.node)
      // .sort(compareFields) // TODO remove this once field ordering is implemented
  ),
  model: (props) => props.viewer.model,
  project: (props) => props.viewer.project,
  viewer: (props) => props.viewer,
})(ReduxContainer)

export default Relay.createContainer(MappedBrowserView, {
  initialVariables: {
    modelName: null, // injected from router
    projectName: null, // injected from router
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        model: modelByName(projectName: $projectName, modelName: $modelName) {
          name
          namePlural
          itemCount
          fields(first: 1000) {
            edges {
              node {
                id
                name
                typeIdentifier
                isList
                defaultValue
                relatedModel {
                  name
                }
                ${HeaderCell.getFragment('field')}
                ${Cell.getFragment('field')}
              }
            }
          }
          ${NewRow.getFragment('model')}
          ${ModelHeader.getFragment('model')}
        }
        project: projectByName(projectName: $projectName) {
          id
          ${ModelHeader.getFragment('project')}
        }
        ${ModelHeader.getFragment('viewer')}
      }
    `,
  },
})
