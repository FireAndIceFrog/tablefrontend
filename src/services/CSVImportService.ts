import { GridNativeColTypes } from '@mui/x-data-grid';
import axios from 'axios'
import { UploadData } from '../Models/UploadData';
import { TableHeaders } from '../Models/UploadModel';
export default class CSVImportService {
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
                obj[headers[j]] = currentline[j]
                    .trim()
                    .replace("\r", "");
            }
            result.push(obj);
        }
        
        return result
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
                minWidth: 120,
                flex: 50
                // width: 80
            })
        }

        return {
            Headers: headers,
            Rows: data.map((x, i) => {
                x["id"] = `${i}`
                return x;
            })
        } as UploadData;
    }

    public static async getData(): Promise<UploadData> {
        const data = await fetch("https://localhost:7127/CSVImport/GetWeeklyData", {
            "method": "GET",
        });

        const jsonData = JSON.parse(await data.text());
        return jsonData as UploadData;
    }

    public static async setData(data: UploadData) {

        await axios({
            method: 'post',
            url: 'https://localhost:7127/CSVImport/SetWeeklyData',
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length"
            }
        })
    }
}