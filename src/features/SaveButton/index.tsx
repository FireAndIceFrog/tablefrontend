import { Button } from "@mui/material"
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { CsvTableActions } from "../CSVTable/CSVTableSlice";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

export default function SaveButton() {
    const Headers = useAppSelector((s) => s.CSVTable.Headers);
    const Rows = useAppSelector((s) => s.CSVTable.Rows);
    const dispatch = useAppDispatch();
    
    return <Button variant="outlined" component="span" startIcon={<SaveOutlinedIcon/>} onClick={()=>dispatch(CsvTableActions.uploadData({Headers, Rows}))}>
        Save Data
    </Button>
}