import { Button } from "@mui/material";
import { useAppDispatch } from "../../app/hooks";
import { CsvTableActions } from "../CSVTable/CSVTableSlice";
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';

export default function RefreshButton() 
{
    const dispatch = useAppDispatch();
    return <Button variant="outlined" component="span" startIcon={<ReplayOutlinedIcon/>}  onClick={()=>dispatch(CsvTableActions.initData())}>
        Refresh Data
    </Button>
}