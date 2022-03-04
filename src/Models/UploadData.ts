import { TableHeaders } from "./UploadModel";

export interface UploadData {
    Headers: TableHeaders;
    Rows: Record<string, any>[];
}