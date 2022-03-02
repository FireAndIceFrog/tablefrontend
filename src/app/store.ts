import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import CSVTableSlice from '../features/CSVTable/CSVTableSlice';

export const store = configureStore({
  reducer: {
    CSVTable: CSVTableSlice,
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
