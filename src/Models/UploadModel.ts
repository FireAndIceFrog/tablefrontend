
import { GridColDef, GridNativeColTypes } from '@mui/x-data-grid';

export default interface UploadModel  {
    field: GridColDef["field"], 
    headerName: GridColDef["headerName"],
    width?: GridColDef["width"],
    type?: GridNativeColTypes,
    minWidth?: GridColDef["minWidth"]
    flex?: GridColDef["flex"]
}

export type TableHeaders = UploadModel[]