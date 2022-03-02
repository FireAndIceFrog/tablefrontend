import { Button } from "@mui/material";
import { useAppDispatch } from "../../app/hooks";
import { CsvTableActions } from "../CSVTable/CSVTableSlice";

export default function DownloadButton() 
{
    const dispatch = useAppDispatch();
    return <Button variant="contained" component="span" onClick={()=>dispatch(CsvTableActions.initData())}>
        Download Data
    </Button>
}