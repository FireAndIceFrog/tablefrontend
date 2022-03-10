
    
import { Skeleton } from '@mui/material';
import { DataGrid, GridCellParams, GridToolbar } from '@mui/x-data-grid';
import { useState, useLayoutEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { CsvTableActions } from '../../reducers/CSVTable/CSVTableSlice';
import DataTable from './DataTable';
import Toolbar, { CustomToolbar } from './Toolbar';
export default function CSVTable() {
    const dispatch = useAppDispatch();
    const Headers = useAppSelector(s => s.CSVTable.Headers);
    
    const Rows = useAppSelector(s => s.CSVTable.Rows);

    const sortColumns = useAppSelector(s => s.CSVTable.sortColumns)
    const loading = useAppSelector(s => s.CSVTable.loading)
    const tableRef = useRef<HTMLDivElement | null>(null);
    const rowCount = useAppSelector(s => s.CSVTable.count)

    const [page, setPage] = useState(0);

    return (
      <div style={{ height: 400, width: '100%' }}>
        { loading && !Headers ? 
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
            sortColumns = {sortColumns}
            columns = {Headers}
            direction={'ltr'}
          />
        </>
      }
      </div>
    );
}