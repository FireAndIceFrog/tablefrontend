import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { UploadData } from '../../Models/UploadData';
import UploadModel from '../../Models/UploadModel';
import CSVImportService from '../../services/CSVImportService';

export interface CSVTableState extends UploadData {
  loading: boolean;
  count: number
  tableId: string
}

const initialState: CSVTableState = {
  Headers: [] as UploadData["Headers"],
  Rows: [] as UploadData["Rows"],
  loading: true,
  count: 0,
  tableId: ""
};

const GetTableId = createAsyncThunk(
  'CSVTable/GetTableId',
  async (_, api) => {
    const id = await CSVImportService.getTableId();
    return id;
  }
);

const initData = createAsyncThunk(
  'CSVTable/fetchData',
  async (_, store) => {
    const action = await store.dispatch(GetTableId());
    const headers = await CSVImportService.getHeaders(action.payload as string);
    const rows = await CSVImportService.getRows(action.payload as string, 0, 100);
    return {
      Headers: headers,
      Rows: rows.data,
      tableId: action.payload as string,
      counts: rows.counts
    };
  }
);

const nextPage = createAsyncThunk(
  'CSVTable/nextPage',
  async ({index, NumPages}: {index: number, NumPages: number}, store) => {
    const tableId = (store.getState() as RootState).CSVTable.tableId;
    const rows = await CSVImportService.getRows(tableId, index, NumPages);
    return rows;
  }
);

const setHeaders = createAsyncThunk(
  'CSVTable/setHeaders',
  async (data: UploadModel[], store) => {
    const tableId = await CSVImportService.setHeaders(data, { createNewId: true });
    return tableId;
  }
);

const setRows = createAsyncThunk(
  'CSVTable/setRows',
  async ({ data, tableId }: {
    data: Record<string, any>[],
    tableId?: string
  }, store) => {
    if(!tableId){
      tableId = (store.getState() as RootState).CSVTable.tableId;
    }
    const _response = await CSVImportService.setRows(data, tableId);
    return;
  }
);

const uploadData = createAsyncThunk(
  'CSVTable/uploadData',
  async (data: UploadData, store) => {
    const action = await store.dispatch(setHeaders(data.Headers))
    await store.dispatch(setRows({data: data.Rows, tableId: action.payload as string})) 
  }
);

const parseCSV = createAsyncThunk(
  'CSVTable/parseCSV',
  async (data: UploadData) => {
    // The value we return becomes the `fulfilled` action payload
    return data;
  }
);

export const CSVTableSlice = createSlice({
  name: 'CSVTable',
  initialState,
  reducers: {
    resetdata: (state) => {
      state.Headers = initialState.Headers;
      state.Rows = initialState.Rows;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initData.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadData.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(setHeaders.fulfilled, (state, action) => {
        state.tableId = action.payload;
      })
      .addCase(initData.fulfilled, (state, action) => {
        state.loading = false;
        state.Headers = action.payload.Headers;
        state.Rows = action.payload.Rows;
        state.count = action.payload.counts;
      })
      .addCase(initData.rejected, (state) => {
        state.loading = false
      })
      .addCase(parseCSV.fulfilled, (state, action) => {
        state.Headers = action.payload.Headers;
        state.Rows = action.payload.Rows;
      })
      .addCase(nextPage.fulfilled, (state, action) => {
        state.Rows = action.payload.data;
        state.count = action.payload.counts;
        state.loading = false
      })
      .addCase(nextPage.rejected, (state) => {
        state.loading = false
      })
      .addCase(nextPage.pending, (state, action) => {
        state.loading = true
      })
      .addCase(GetTableId.fulfilled, (state, action) => {
        state.tableId = action.payload;
      });
  },
});

export const CsvTableActions = {...CSVTableSlice.actions, initData, uploadData, parseCSV, nextPage};
export default CSVTableSlice.reducer;
