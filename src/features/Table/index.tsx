
    
import { Skeleton } from '@mui/material';
import { DataGrid, GridCellParams, GridToolbar } from '@mui/x-data-grid';
import { useLayoutEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { CustomToolbar } from './Toolbar';
export default function CSVTable() {
    const { Headers, Rows } = useAppSelector(s => s.CSVTable.data)
    const loading = useAppSelector(s => s.CSVTable.loading)
    return (
      <div style={{ height: 400, width: '100%' }}>
        { loading ? 
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
            }}
            rows={Rows}
            columns={Headers}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            components={{ Toolbar: CustomToolbar }}
          />
      }
      </div>
    );
}