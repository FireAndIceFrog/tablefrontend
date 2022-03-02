import React, { useCallback, useRef, useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import styles from './Counter.module.css';
import { CsvTableActions } from '../CSVTable/CSVTableSlice';
import { UploadButton } from '../UploadButton/UploadButton';
import SaveButton from '../SaveButton';
import DownloadButton from '../DownloadButton';

export function Counter() {
  const data = useAppSelector((s) => s.CSVTable.data);
  const loading = useAppSelector((s) => s.CSVTable.data);

  return (
    <div>
      <div className={styles.row}>
        <UploadButton/>
        <SaveButton/>
        <DownloadButton/>
      </div>
      <span>
        Data: {JSON.stringify(data)}
      </span>
    </div>
  );
}
