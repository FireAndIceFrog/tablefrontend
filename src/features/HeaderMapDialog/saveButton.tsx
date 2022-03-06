import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../app/hooks";
import { CsvTableActions } from "../../reducers/CSVTable/CSVTableSlice";
import { TableLookupSliceActions } from "../../reducers/TableLookupSlice/TableLookupSlice";
import CSVConvertService from "../../services/CSVConvertService";

export default function SaveButton()
{
    const intermediaryRows = useAppSelector(s => s.TableLookup.intermediateRows);
    const dispatch = useDispatch();
    const headerMap = useAppSelector(s => s.TableLookup.HeadersMap);

    const handleSave = async () => {
        if(intermediaryRows)
        {
            const convertService = new CSVConvertService(intermediaryRows);
            if(headerMap)
            {
                const newRows = await convertService.ConvertToTableLookupAsync(headerMap as Record<string, string>);
                dispatch(CsvTableActions.uploadRows({data: newRows}));
                dispatch(TableLookupSliceActions.resetdata());
            }
        }
    };
    return <Button variant="outlined" color="primary" onClick={handleSave}> 
        Save
    </Button>
}