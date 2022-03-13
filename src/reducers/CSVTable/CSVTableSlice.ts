import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import FilterModel from '../../Models/FilterModel';
import SorterModel from '../../Models/SorterModel';
import { UploadData } from '../../Models/UploadData';
import UploadModel from '../../Models/UploadModel';
import CSVImportService from '../../services/CSVImportService';
import { SortColumn } from "react-data-grid";

export interface CSVTableState extends UploadData {
  loading: boolean;
  count: number
  tableId: string
  sorter?: SorterModel[],
  index: number,
  numPages: number,
  filters?: Record<string, FilterModel>,
  gettingRows: boolean,
}

const initialState: CSVTableState = {
  Headers: [] as UploadData["Headers"],
  Rows: [] as UploadData["Rows"],
  loading: true,
  count: 0,
  tableId: "",
  index: 0,
  numPages: 100,
  gettingRows: false
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

const setFilters = createAsyncThunk(
  'CSVTable/setFilter',
  async (filters: FilterModel[], store) => {
    const index = 0;
    const NumPages = (store.getState() as RootState).CSVTable.numPages;
    const sorter = (store.getState() as RootState).CSVTable.sorter ?? [];
    const action = await store.dispatch(getRows({
      index,
      NumPages,
      sorter: sorter[0],
      filters,
    }));
    return filters.reduce((acc, filter)=>{
      acc[filter.key] = filter
      return acc
    }, {} as Record<string, FilterModel> )
  }
);

const setSorter = createAsyncThunk(
  'CSVTable/setSorter',
  async (sorters: SorterModel[], store) => {
    const index = 0;
    const NumPages = (store.getState() as RootState).CSVTable.numPages;
    const filters = Object.values((store.getState() as RootState).CSVTable.filters ?? {});
    const action = await store.dispatch(getRows({
      index,
      NumPages,
      sorter: sorters[0],
      filters,
    }));
    return sorters;
  }
);

const getRows = createAsyncThunk(
  'CSVTable/getRows',
  async ({index, NumPages, filters, sorter, addRows}: {index: number, NumPages: number, filters?: FilterModel[], sorter?: SorterModel, addRows?: boolean}, store) => {
    const tableId = (store.getState() as RootState).CSVTable.tableId;
    if(!filters) filters = Object.values((store.getState() as RootState).CSVTable.filters ?? {});
    if(!sorter) sorter = ((store.getState() as RootState).CSVTable.sorter ?? [])[0];

    const rows = await CSVImportService.getRows(tableId, index, NumPages, filters, sorter);
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

const uploadRows = createAsyncThunk(
  'CSVTable/uploadRows',
  async ({ data, tableId }: {
    data: Record<string, any>[],
    tableId?: string
  }, store) => {
    if(!tableId){
      tableId = (store.getState() as RootState).CSVTable.tableId;
    }
    const _response = await CSVImportService.setRows(data, tableId);
    return data;
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

const UpdateSortColumns = createAsyncThunk(
  'CSVTable/updateSortColumns',
  async (data: SortColumn[], store) => {
    // The value we return becomes the `fulfilled` action payload
    
      const sorters = data?.map(x => {
        const model = {} as SorterModel;
        model.isAscending = x.direction === "ASC";
        model.key = x.columnKey;
        return model;
      })
      store.dispatch(setSorter(sorters))
  }
);

const UpdateFilterColumns = createAsyncThunk(
  'CSVTable/UpdateFilterColumns',
  async (data: FilterModel, store) => {
    // The value we return becomes the `fulfilled` action payload
    const filters = {...(store.getState() as RootState).CSVTable.filters ?? {}}
    if(data?.comparator) {
      filters[data.key] = data
    }
    else if(!data?.comparator)
    {
      delete filters[data.key]
    }
    store.dispatch(setFilters(Object.values(filters)))
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
    },
    updateRows: (state, action) => {
      state.Rows = action.payload
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setSorter.pending, (state, action) => {
        if(action.meta.arg.length > 0)
          state.sorter = action.meta.arg
        else
          state.sorter = undefined 
      })
      .addCase(initData.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadData.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(setHeaders.fulfilled, (state, action) => {
        state.tableId = action.payload;
      })
      .addCase(uploadRows.pending, (state, action) => {
        state.Rows = [...state.Rows,...action.meta.arg.data];
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
      .addCase(getRows.fulfilled, (state, action) => {
        state.Rows = Boolean(action.meta.arg.addRows) ? [...state.Rows, ...action.payload.data] : action.payload.data;
        state.count = action.payload.counts;
        state.loading = false
        
        state.gettingRows = false
        state.index = action.meta.arg.index;
        state.numPages = action.meta.arg.NumPages;
      })
      .addCase(getRows.rejected, (state) => {
        state.loading = false
        
        state.gettingRows = false
      })
      .addCase(getRows.pending, (state, action) => {
        if (!action.meta.arg.addRows) {
          state.loading = true
        }
        state.gettingRows = true
      })
      .addCase(GetTableId.fulfilled, (state, action) => {
        state.tableId = action.payload;
      })
      .addCase(setFilters.fulfilled, (state, action) => {
        state.filters = action.payload;
      })
  },
});

export const CsvTableActions = {...CSVTableSlice.actions, UpdateFilterColumns, UpdateSortColumns, initData, uploadData, parseCSV, getRows, uploadRows};
export default CSVTableSlice.reducer;
