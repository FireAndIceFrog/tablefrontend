import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { UploadData } from '../../Models/UploadData';
import UploadModel from '../../Models/UploadModel';
import CSVImportService from '../../services/CSVImportService';

export interface TableLookupState {
    showPopup: boolean;
    HeadersMap?: Record<string, string | null>;
    headerOptions?: string[];
    intermediateRows?: Record<string, any>[];
}

const initialState: TableLookupState = {
  showPopup: false,
};

const initData = createAsyncThunk(
  'TableLookupSlice/fetchData',
  async (data: UploadData, store) => {
    
      const HeaderMap = (store.getState() as RootState).CSVTable.Headers.reduce((acc, header) => {
        if(header.headerName) {
          acc[header.headerName] = "none"
        }
        return acc;
      }, {} as Record<string, string | null>);

      const headerOptions: string[] = data.Headers.map(header => header.headerName).filter(header => !!header) as string[];

      return {
        HeaderMap,
        headerOptions,
        intermediateRows: data.Rows,
      }
  }
);

export const TableLookupSlice = createSlice({
  name: 'TableLookupSlice',
  initialState,
  reducers: {
    resetdata: (state) => {
        state.showPopup = false;
        state.HeadersMap = undefined;
    },
    updateKey: (state, action: PayloadAction<{key: string, value: string}>) => {
      state.HeadersMap![action.payload.key] = action.payload.value;
    },
    updateRows: (state, action: PayloadAction<Record<string, string>[]>) => {
      state.intermediateRows = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initData.fulfilled, (state, action) => {
        state.showPopup = true;
        state.HeadersMap = action.payload.HeaderMap;
        state.headerOptions = action.payload.headerOptions;
        state.intermediateRows = action.payload.intermediateRows;
      })
  },
});

export const TableLookupSliceActions = {...TableLookupSlice.actions, initData};
export default TableLookupSlice.reducer;
