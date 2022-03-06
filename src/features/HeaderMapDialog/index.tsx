import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch } from 'react-redux';
import { TableLookupSliceActions } from '../../reducers/TableLookupSlice/TableLookupSlice';
import { useAppSelector } from '../../app/hooks';
import HeadersCompareTable from './HeadersCompareTable';
import { Paper } from '@mui/material';
import CSVConvertService from '../../services/CSVConvertService';
import SaveButton from './saveButton';

const width = "xl";
export default function HeaderMapDialog() {
  const dispatch = useDispatch();
  const open = useAppSelector(s => s.TableLookup.showPopup)


  const handleClose = () => {
    dispatch(TableLookupSliceActions.resetdata())
  };

  return (
      <Dialog
        fullWidth={true}
        maxWidth={width}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Header Mappings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please map the current headers to the incoming ones:
          </DialogContentText>
          <Paper elevation={3} style={{
            marginTop: "2%",
            paddingTop: "2%",
            paddingLeft: "4%",
            paddingRight: "4%",
            marginLeft: "-4%",
            marginRight: "-4%",
            width: "fit-content",
            }}>
            <HeadersCompareTable/>
          </Paper>
        </DialogContent>
        <DialogActions>
          <SaveButton/>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
  );
}
