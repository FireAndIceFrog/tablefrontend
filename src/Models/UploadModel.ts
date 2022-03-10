
import { GridColDef, GridNativeColTypes } from '@mui/x-data-grid';

export default interface UploadModel  {
    key: string, 
    name: string,
    width?: GridColDef["width"],
    type?: GridNativeColTypes,
    resizable: boolean
    sortable?: boolean
}

export type TableHeaders = UploadModel[]
