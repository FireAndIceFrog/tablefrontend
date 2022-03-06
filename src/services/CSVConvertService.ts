import { v4 as uuidv4 } from 'uuid';
export default class CSVConvertService
{
    private Rows: Record<string, any>[];
    constructor(Rows: Record<string, any>[])
    {
        this.Rows = Rows;
    }

    public async ConvertToTableLookupAsync(newHeaders: Record<string, string>)
    {
        return await Promise.resolve(this.ConvertToTableLookup(newHeaders));
    }

    public ConvertToTableLookup(newHeaders: Record<string, string>)
    {
        const headers = Object.entries(newHeaders);
        return this.Rows.map(x => {
            return headers.reduce((acc, [oldHeader, newHeader]) => {
                const updatedHeader = x[newHeader];
                if(updatedHeader !== "none") {
                    acc[oldHeader] = updatedHeader
                }
                acc["_id"] = uuidv4();
                return acc;
            }, {} as Record<string, any>);
        })
    }
}
