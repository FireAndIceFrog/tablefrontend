import { Button } from "@mui/material"
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { CsvTableActions } from "../CSVTable/CSVTableSlice";

export default function SaveButton() {
    const data = useAppSelector((s) => s.CSVTable.data);
    const dispatch = useAppDispatch();
    
    return <Button variant="contained" component="span" onClick={()=>dispatch(CsvTableActions.uploadData(data))}>
        Save Data
    </Button>
}