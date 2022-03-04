
    
import { Skeleton } from '@mui/material';
import { DataGrid, GridCellParams, GridToolbar } from '@mui/x-data-grid';
import { useState, useLayoutEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { CsvTableActions } from '../CSVTable/CSVTableSlice';
import { CustomToolbar } from './Toolbar';
export default function CSVTable() {
    const dispatch = useAppDispatch();
    const Headers = useAppSelector(s => s.CSVTable.Headers);
    
    const Rows = useAppSelector(s => s.CSVTable.Rows);

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
          <DataGrid
            classes={{
                columnHeaders: 'headerCell',
                virtualScrollerRenderZone: "CSVTableVirtualScrollerRenderZone",
            }}
            rows={loading ? [] : Rows}
            columns={Headers}
            checkboxSelection
            components={{ Toolbar: CustomToolbar }}
            paginationMode ={"server"}
            rowCount = {rowCount}
            pageSize = {1}
            onPageChange={(pageNo, details ) => {setPage(pageNo); dispatch(CsvTableActions.nextPage({index: pageNo, NumPages: rowCount}))}}
          />
      }
      </div>
    );
}