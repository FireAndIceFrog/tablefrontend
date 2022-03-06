import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import CSVTableSlice from '../reducers/CSVTable/CSVTableSlice';
import TableLookupSlice from '../reducers/TableLookupSlice/TableLookupSlice';
export const store = configureStore({
  reducer: {
    CSVTable: CSVTableSlice,
    TableLookup: TableLookupSlice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
