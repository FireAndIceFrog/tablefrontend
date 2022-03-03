import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UploadData } from '../../Models/UploadData';
import CSVImportService from '../../services/CSVImportService';

export interface CSVTableState extends UploadData {
  loading: boolean;
  count: number
}

const initialState: CSVTableState = {
  Headers: [] as UploadData["Headers"],
  Rows: [] as UploadData["Rows"],
  loading: true,
  count: 0
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
const initData = createAsyncThunk(
  'CSVTable/fetchData',
  async (_, api) => {
    const response = await CSVImportService.getData();
    // The value we return becomes the `fulfilled` action payload
    api.dispatch(countAll());
    return response;
  }
);

const nextPage = createAsyncThunk(
  'CSVTable/nextPage',
  async (pageNumber: number) => {
    const response = await CSVImportService.getData(pageNumber);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

const uploadData = createAsyncThunk(
  'CSVTable/uploadData',
  async (data: UploadData) => {
    const _response = await CSVImportService.setData(data);
    // The value we return becomes the `fulfilled` action payload
    return;
  }
);

const parseCSV = createAsyncThunk(
  'CSVTable/parseCSV',
  async (data: UploadData) => {
    // The value we return becomes the `fulfilled` action payload
    return data;
  }
);

const countAll = createAsyncThunk(
  'CSVTable/count',
  async () => {
    // The value we return becomes the `fulfilled` action payload
    return CSVImportService.CountAllData();
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
      .addCase(initData.fulfilled, (state, action) => {
        state.loading = false;
        state.Headers = action.payload.Headers;
        state.Rows = action.payload.Rows;
      })
      .addCase(initData.rejected, (state) => {
        state.loading = false
      })
      .addCase(parseCSV.fulfilled, (state, action) => {
        state.Headers = action.payload.Headers;
        state.Rows = action.payload.Rows;
      })
      .addCase(countAll.fulfilled, (state, action) => {
        state.count = action.payload;
      })
      .addCase(nextPage.fulfilled, (state, action) => {
        state.Rows = action.payload.Rows;
        state.loading = false
      })
      .addCase(nextPage.rejected, (state) => {
        state.loading = false
      })
      .addCase(nextPage.pending, (state, action) => {
        state.loading = true
      })

  },
});

export const CsvTableActions = {...CSVTableSlice.actions, initData, uploadData, parseCSV, countAll, nextPage};
export default CSVTableSlice.reducer;
