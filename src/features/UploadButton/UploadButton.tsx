import React, { useCallback, useRef } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { CsvTableActions } from '../CSVTable/CSVTableSlice';
import { Button, Input } from '@mui/material';

export function UploadButton() {
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const onFileSubmit = useCallback((e) => {
    const file = fileRef.current?.files?.[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if(data)
        {
          dispatch(CsvTableActions.parseCSV(data as string));
        }
      };
      reader.readAsText(file);
    }
  }, [dispatch]);

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
        <Button variant="contained" component="span" >
            Upload
        </Button>
    </label>
  );
}
