import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import styles from './Counter.module.css';
import { CsvTableActions } from '../CSVTable/CSVTableSlice';
import { UploadButton } from '../UploadButton/UploadButton';
import SaveButton from '../SaveButton';
import DownloadButton from '../RefreshButton';
import CSVTable from '../Table';
import { Skeleton } from '@mui/material';

export function Counter() {
  const data = useAppSelector((s) => s.CSVTable.data);
  const loading = useAppSelector((s) => s.CSVTable.loading);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(CsvTableActions.initData())
  }, [dispatch])

  return (
    <div>
      <div className={styles.table}>
        <CSVTable/>
      </div>
    </div>
  );
}
