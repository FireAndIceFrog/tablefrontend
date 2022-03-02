import axios from 'axios'
export default class CSVImportService {
    public static readCSVAsync = (csv: string, delim = ",") => Promise.resolve(CSVImportService.readCSV(csv, delim))
    public static readCSV(csv: string, delim = ","): Record<string, string>[] {
        var lines=csv.split("\n");
        var result: Array<Record<string, string>> = [];
        var headers=lines[0].split(",").map(x => x
            .trim()
            .replace("\r", "")
            .replace(" ", ""));
        for(var i=1;i<lines.length;i++){
        
            var obj = {} as Record<string, string>;
            var currentline=lines[i].split(",");
        
            for(var j=0;j<headers.length;j++){
                obj[headers[j]] = currentline[j]
                    .trim()
                    .replace("\r", "");
            }
            result.push(obj);
        }
        
        return result
    }

    public static async getData(): Promise<Array<Record<string, string>>> {
        var data = await fetch("https://localhost:7127/CSVImport/GetWeeklyData", {
            "method": "GET",
        });

        var jsonData = JSON.parse(await data.text());
        return jsonData as Array<Record<string, string>>;
    }

    public static async setData(data: Array<Record<string, string>>) {

        await axios({
            method: 'post',
            url: 'https://localhost:7127/CSVImport/SetWeeklyData',
            data: JSON.stringify({
                data
            }),
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length"
            }
        })
    }
}