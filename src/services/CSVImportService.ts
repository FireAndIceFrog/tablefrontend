import { GridNativeColTypes } from '@mui/x-data-grid';
import axios from 'axios'
import GetRowsModel from '../Models/GetRowsModel';
import { TableheaderUpload } from '../Models/TableheaderUpload';
import { UploadData } from '../Models/UploadData';
import UploadModel, { TableHeaders } from '../Models/UploadModel';
import { v4 as uuidv4 } from 'uuid';
import FilterModel from '../Models/FilterModel';
import SorterModel from '../Models/SorterModel';
import config from "../config.json";

export default class CSVImportService {
    public static targetLocation = config["CSVAPIPath"];
    public static readCSVAsync = (csv: string, delim = ",") => Promise.resolve(CSVImportService.readCSV(csv, delim))
    public static readCSV(csv: string, delim = ","): Record<string, string>[] {
        const lines=csv.split("\n");
        const result: Array<Record<string, string>> = [];
        const headers=lines[0].split(",").map(x => x
            .trim()
            .replace("\r", "")
            .replace(" ", ""));
        for(let  i=1;i<lines.length;i++){
        
            const obj = {} as Record<string, string>;
            const currentline=lines[i].split(",");
        
            for(let j=0;j<headers.length;j++){
                try {
                    obj[headers[j]] = currentline[j]
                        .trim()
                        .replace("\r", "");
                } catch(e) {}
            }
            result.push(obj);
        }
        
        return result
    }

    public static async ClearAllData() 
    {
        await fetch(`${this.targetLocation}/CSVImport/ClearAllData`, {
            "method": "DELETE",
        });
    }

    public static ConvertCSVToTableData(data: Record<string, string>[]): UploadData {
        const headers: TableHeaders = [];
        if(data.length === 0) 
            throw new Error("No data to convert");
        
        for (const dataKey in data[0]) {
            const key = data[0][dataKey];
            let dataType: GridNativeColTypes = !isNaN(+key) ? "number" : 
                key.toLowerCase() === "true" || key.toLowerCase()  ==="false" ? "boolean" : 
                (new Date(key)).toString() !== "Invalid Date" && key.indexOf("/") !== -1  ? "date": 
                (new Date(+key)).toString() !== "Invalid Date"? "dateTime":
                "string";

            headers.push({
                field: dataKey,
                headerName: dataKey,
                type: dataType,
                flex: 50,
                dataKey: dataKey,
                label: dataKey,
                width: 80
            })
        }

        return {
            Headers: headers,
            Rows: data.map((x, i) => {
                x["_id"] = `${uuidv4()}`
                return x;
            })
        } as UploadData;
    }

    public static async getRows(tableId: string, start: number, numRows: number, filters?: FilterModel[], sorter?: SorterModel): Promise<GetRowsModel> {
        
        const reqData = {} as any;
        if(filters)
            reqData["filters"] = filters;
        if(sorter)
            reqData["sorter"] = sorter;

            
        const response = await axios({
            method: 'post',
            url: `${this.targetLocation}/CSVImport/GetRows?${tableId ? `TableId=${tableId}&` : ""}start=${start}&numRows=${numRows}`,
            data: JSON.stringify(reqData),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length"
            }
        })

        const jsonData = response.data;
        return jsonData as GetRowsModel;
    }

    private static async publishRows(data: Record<string, any>[], tableId: string) {
        await axios({
            method: 'post',
            url: `${this.targetLocation}/CSVImport/SetRows?TableId=${tableId}`,
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length"
            }
        })
    }

    public static async setRows(data: Record<string, any>[], tableId: string) {
        const len = data.length;
        const splitLen = 500
        const tasks: Promise<void>[] = [];
        for(let i = 0; i < len; i += splitLen) {
            const subset = data.slice(i, i + splitLen)
            tasks.push(CSVImportService.publishRows(subset, tableId));
        }

        await Promise.all(tasks)
    }

    public static async getHeaders(tableId?: string): Promise<UploadModel[]> {
        const data = await fetch(`${this.targetLocation}/CSVImport/GetHeaders?${tableId ? `TableId=${tableId}` : ""}`, {
            "method": "GET",
        });

        const jsonData: TableheaderUpload = JSON.parse(await data.text());
        return jsonData.data;
    }

    public static async setHeaders(headers: UploadModel[], { createNewId = true }): Promise<string> {
        const id = await axios({
            method: 'post',
            url: `${this.targetLocation}/CSVImport/SetHeaders?createNewId=${createNewId}`,
            data: JSON.stringify({
                data: headers
            } as TableheaderUpload),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length"
            }
        })
        return id.data;
    }

    public static async getTableId(): Promise<string> {
        const data = await fetch(`${this.targetLocation}/CSVImport/GetMostRecentTableId`, {
            "method": "GET",
        });

        const jsonData = await data.text()
        return jsonData;
    }
}