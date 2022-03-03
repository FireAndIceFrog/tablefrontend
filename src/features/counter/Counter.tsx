import React, { useLayoutEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import styles from './Counter.module.css';
import { CsvTableActions } from '../CSVTable/CSVTableSlice';
import CSVTable from '../Table';

export function Counter() {
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
