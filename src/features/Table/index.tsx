
    
import { Skeleton } from '@mui/material';
import { DataGrid, GridCellParams, GridToolbar } from '@mui/x-data-grid';
import { useState, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { SortColumn } from 'react-data-grid';
import { isGetAccessorDeclaration } from 'typescript';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { CsvTableActions } from '../../reducers/CSVTable/CSVTableSlice';
import DataTable from './DataTable';
import Toolbar, { CustomToolbar } from './Toolbar';

const rowHeight = 60

export default function CSVTable() {
    const dispatch = useAppDispatch();
    const Headers = useAppSelector(s => s.CSVTable.Headers);
    const Rows = useAppSelector(s => s.CSVTable.Rows);
    const sorters = useAppSelector(s => s.CSVTable.sorter)
    const loading = useAppSelector(s => s.CSVTable.loading)
    const gettingRows = useAppSelector(s => s.CSVTable.gettingRows)
    const count = useAppSelector(s => s.CSVTable.count)
    const pages = useAppSelector(s => s.CSVTable.numPages)
    const index = useAppSelector(s => s.CSVTable.index)

    const mappedSort = useMemo(() => {
      return sorters?.map(x => ({
        direction: x.isAscending ? "ASC" : "DESC",
        columnKey: x.key
      } as SortColumn))
    }, [sorters])

    const onScrollHandler = useCallback((event: React.UIEvent<HTMLDivElement>, ...args) => {
      const isAtBottom = event.currentTarget.scrollTop + rowHeight * 2 >= (event.currentTarget.scrollHeight - event.currentTarget.clientHeight)
      if(!loading && isAtBottom && count > (index+pages) && !gettingRows) {
        dispatch(CsvTableActions.getRows({
          index: Rows.length,
          NumPages: 100,
          addRows: true
        }))
      }
      return
    }, [Rows.length, count, dispatch, index, loading, pages, gettingRows])


    return (
      <div style={{ height: 400, width: '100%' }}>
        { loading || !Headers ? 
          <>
            <Skeleton variant="rectangular" height = "10%" width ="98%" style = {{marginLeft: "1%"}}/>
            <Skeleton variant="rectangular" height = "10%" width ="98%" style = {{marginLeft: "1%", marginTop: "1%"}} />
            <Skeleton variant="rectangular" height = "10%" width ="98%" style = {{marginLeft: "1%", marginTop: "1%"}}/>
            <Skeleton variant="rectangular" height = "10%" width ="98%" style = {{marginLeft: "1%", marginTop: "1%"}}/>
            <Skeleton variant="rectangular" height = "10%" width ="98%" style = {{marginLeft: "1%", marginTop: "1%"}}/>
            <Skeleton variant="rectangular" height = "10%" width ="98%" style = {{marginLeft: "1%", marginTop: "1%"}}/>
          </>
        :
        <>
          {Toolbar()}
          <DataTable
            rows = {Rows}
            onRowsChange = {(Rows: any[]) => dispatch(CsvTableActions.updateRows(Rows))}
            onSortChange = {(sorters: any[]) => dispatch(CsvTableActions.UpdateSortColumns(sorters))}
            sortColumns = {mappedSort}
            columns = {Headers}
            direction={'ltr'}
            onScroll = {onScrollHandler}
            rowHeight = {rowHeight}
          />
        </>
      }
      </div>
    );
}