import { Button } from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useAppDispatch } from "../../app/hooks";
import { CsvTableActions } from "../../reducers/CSVTable/CSVTableSlice";
import CSVImportService from "../../services/CSVImportService";

export default function ClearAllData() 
{
    const dispatch = useAppDispatch();
    return <Button variant="outlined" component="span" startIcon={<DeleteOutlineOutlinedIcon/>} onClick={()=>{
        dispatch(CsvTableActions.resetdata())
        CSVImportService.ClearAllData();
    }}>
        Clear Data
    </Button>
}