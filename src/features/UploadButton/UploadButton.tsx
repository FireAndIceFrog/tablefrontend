import React, { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { CsvTableActions } from '../../reducers/CSVTable/CSVTableSlice';
import { Button, Input } from '@mui/material';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import CSVImportService from '../../services/CSVImportService';
import { TableLookupSliceActions } from '../../reducers/TableLookupSlice/TableLookupSlice';
import { UploadData } from '../../Models/UploadData';

export function UploadButton() {
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const headers = useAppSelector(x => x.CSVTable.Headers);
  const onFileSubmit = useCallback(async (e) => {
    dispatch(CsvTableActions.setLoading(true));
    const file = fileRef.current?.files?.[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      const load = async(e: any) => {
        const data = e.target?.result;
        if(data)
        {
          const fileName = file.name;
          const response = await CSVImportService.readCSVAsync(data as string, fileName);
          let parsedData: UploadData = {
            Headers: [],
            Rows: []
          }
          try {
            parsedData = await CSVImportService.ConvertCSVToTableDataAsync(response.data);
          } catch (error) {
          }
          headers.forEach(header => {
            header.type = response.types[header.key];
          })
          
          dispatch(CsvTableActions.setLoading(false));
          const action = (!headers || headers.length  === 0) ? 
            CsvTableActions.parseCSV(parsedData) 
            : 
            TableLookupSliceActions.initData(parsedData)
          dispatch(action as any);
        }
      };
      reader.onload = (e) => void load(e);
      reader.readAsText(file);
      
    }
    
  }, [dispatch, headers]);

  return (
    <label htmlFor="contained-button-file" >
        <Input 
            id="contained-button-file" 
            type="file" 
            inputRef={fileRef} 
            style ={{"display": "none"}} 
            onChange={onFileSubmit}
            // onClick={(e: React.MouseEvent<HTMLInputElement>) => e.currentTarget.value = ""}
        />
        <Button variant="outlined" component="span" startIcon={<FileUploadOutlinedIcon/>}>
            Upload
        </Button>
    </label>
  );
}
