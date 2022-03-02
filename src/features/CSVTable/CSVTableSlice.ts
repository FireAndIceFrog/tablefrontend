import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CSVImportService from '../../services/CSVImportService';

export interface CSVTableState {
  data: Record<string, string>[];
  loading: boolean;
}

const initialState: CSVTableState = {
  data: [],
  loading: true
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
const initData = createAsyncThunk(
  'CSVTable/fetchData',
  async () => {
    const response = await CSVImportService.getData();
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

const uploadData = createAsyncThunk(
  'CSVTable/uploadData',
  async (data: Record<string, string>[]) => {
    const _response = await CSVImportService.setData(data);
    // The value we return becomes the `fulfilled` action payload
    return;
  }
);

const parseCSV = createAsyncThunk(
  'CSVTable/parseCSV',
  async (data: string) => {
    const response = await CSVImportService.readCSVAsync(data);
    // The value we return becomes the `fulfilled` action payload
    return response;
  }
);

export const CSVTableSlice = createSlice({
  name: 'CSVTable',
  initialState,
  reducers: {

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
        state.data = action.payload;
      })
      .addCase(parseCSV.fulfilled, (state, action) => {
        state.data = action.payload;
      })

  },
});

export const CsvTableActions = {...CSVTableSlice.actions, initData, uploadData, parseCSV};
export default CSVTableSlice.reducer;
