import * as React from 'react'
import * as Immutable from 'immutable'
import {InfiniteLoader, Grid} from 'react-virtualized'
import {Model, Project} from '../../types/types'
import DataActionRow from '../../views/models/BrowserView/DataActionRow'

interface Props {
  minimumBatchSize?: number
  threshold?: number
  width: number
  height: number
  scrollTop?: number
  columnCount: number
  columnWidth: (input: any) => number
  loadMoreRows: (input: any) => Promise<any>
  addNew: boolean
  onScroll?: (input: any) => void
  model: Model
  project: Project

  loadedList: Immutable.List<boolean>

  rowCount: number
  rowHeight: number
  cellRenderer: (input: any) => JSX.Element | string
  loadingCellRenderer: (input: any) => JSX.Element | string

  headerHeight: number
  headerRenderer: (input: any) => JSX.Element | string
  fieldColumnWidths: number

  addRowHeight: number

  hideNewRow: () => any
  addNewNode: () => any,
}

export default class InfiniteTable extends React.Component<Props, {}> {

  render() {
    console.log(this.props.columnWidth)
    return (
      <div style={{height: '100%', position: 'relative'}}>
        <InfiniteLoader
          minimumBatchSize={this.props.minimumBatchSize}
          threshold={this.props.threshold}
          rowCount={this.props.rowCount}
          loadMoreRows={this.loadMoreRows}
          isRowLoaded={({index}) => this.props.loadedList.get(index)}
          >
          {({onRowsRendered, registerChild}) => (
            <div style={{display: 'flex', flexDirection: 'row', height: '100%', position: 'relative'}}>
              <Grid
                columnWidth={this.props.columnWidth}
                columnCount={this.props.columnCount}
                height={this.props.headerHeight}
                cellRenderer={this.props.headerRenderer}
                cellStyle={{position: 'absolute', marginTop: '-1px'}}
                rowHeight={this.props.headerHeight}
                rowCount={1}
                style={{overflowX: 'visible', overflowY: 'visible', width: 'auto', position: 'relative'}}
                width={this.props.width}
              />
              <DataActionRow
                width={this.props.width}
                height={this.props.height}
                headerHeight={this.props.headerHeight}
                model={this.props.model}
                project={this.props.project}
                addNewNode={this.props.addNewNode}
                hideNewRow={this.props.hideNewRow}
                fieldColumnWidths={this.props.fieldColumnWidths}
                ref={registerChild}
              />
              <Grid
                ref={registerChild}
                width={this.props.width}
                height={this.props.height - this.props.headerHeight - this.props.addRowHeight}
                style={{
                  overflow: 'scroll',
                  position: 'absolute',
                  width: 'auto',
                  left: 0,
                  top: this.props.headerHeight + this.props.addRowHeight,
                }}
                scrollTop={this.props.scrollTop ? this.props.scrollTop : null}
                onScroll={this.props.onScroll}
                cellStyle={{position: 'absolute'}}
                rowHeight={this.props.rowHeight}
                columnCount={this.props.columnCount}
                columnWidth={this.props.columnWidth}
                rowCount={this.props.rowCount}
                cellRenderer={this.renderCell}
                onSectionRendered={(section) => this.onGridRowsRendered(section, onRowsRendered)}
              />
            </div>
          )}
        </InfiniteLoader>
      </div>
    )
  }

  private renderCell = (input) => {
    if (this.props.loadedList.get(input.rowIndex)) {
      return this.props.cellRenderer(input)
    } else {
      return this.props.loadingCellRenderer(input)
    }
  }

  private loadMoreRows = (input) => {
    return new Promise((resolve, reject) => {
      this.props.loadMoreRows(input).then(() => {
        resolve(true)
      })
    })
  }

  private onGridRowsRendered = (section, onRowsRendered) => {
    onRowsRendered({
      startIndex: section.rowStartIndex,
      stopIndex: section.rowStopIndex,
      overscanStartIndex: section.rowOverscanStartIndex,
      overscanStopIndex: section.rowOverscanStopIndex,
    })
  }
}
