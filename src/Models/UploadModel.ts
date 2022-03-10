
import { GridColDef, GridNativeColTypes } from '@mui/x-data-grid';

export default interface UploadModel  {
    field: GridColDef["field"], 
    headerName: GridColDef["headerName"],
    width: GridColDef["width"],
    type?: GridNativeColTypes,
    minWidth?: GridColDef["minWidth"]
    flex?: GridColDef["flex"]
    dataKey: string
    label: string
}

export type TableHeaders = UploadModel[]
