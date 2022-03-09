
    
import { Direction, Grid, Paper, Skeleton } from '@mui/material';
import { DataGrid, GridCellParams, GridToolbar } from '@mui/x-data-grid';
import { useState, useLayoutEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { CsvTableActions } from '../../reducers/CSVTable/CSVTableSlice';
import Toolbar from './Toolbar';
import VirtualTable from "./VirtualTable";
export default function VirtualTableWrapped() {
    const dispatch = useAppDispatch();
    const Headers = useAppSelector(s => s.CSVTable.Headers);
    
    const Rows = useAppSelector(s => s.CSVTable.Rows);

    const loading = useAppSelector(s => s.CSVTable.loading)
    const tableRef = useRef<HTMLDivElement | null>(null);
    const rowCount = useAppSelector(s => s.CSVTable.count)

    const [page, setPage] = useState(0);
    
    const onResize = (index: number, event: MouseEvent | TouchEvent, direction: Direction, elementRef: HTMLElement, delta: any) => {
          console.log(`onResize: ${direction} ${delta.width}; indes ${index}`)          
    }

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
                <div>
                    { Toolbar() }
                </div>
                <div style={{
                    width: "95vw",
                    height: "80vh",
                    marginLeft:"2.5vw"
                }}>
                        <VirtualTable
                        onResizeHeader = {onResize}
                        rowCount={Rows.length}
                        columns={Headers}
                        rowGetter={({ index }: any) => Rows[index]}
                        headerHeight= {100}
                        rowHeight= {100}
                        />
                </div>
            </>
        }
      </div>
    );
}