import { Button } from "@mui/material"
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { CsvTableActions } from "../CSVTable/CSVTableSlice";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

export default function SaveButton() {
    const data = useAppSelector((s) => s.CSVTable.data);
    const dispatch = useAppDispatch();
    
    return <Button variant="outlined" component="span" startIcon={<SaveOutlinedIcon/>} onClick={()=>dispatch(CsvTableActions.uploadData(data))}>
        Save Data
    </Button>
}