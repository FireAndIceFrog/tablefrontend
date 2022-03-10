import { Props, useState } from "react";
import DataGrid, { Column, CopyEvent, FillEvent, PasteEvent, SelectColumn } from "react-data-grid";

const highlightClassname = `
  .rdg-cell {
    background-color: #9370db;
    color: white;
  }
  &:hover .rdg-cell {
    background-color: #800080;
  }
`;

export interface Row {
  id: string;
  avatar: string;
  email: string;
  title: string;
  firstName: string;
  lastName: string;
  street: string;
  zipCode: string;
  date: string;
  bs: string;
  catchPhrase: string;
  companyName: string;
  words: string;
  sentence: string;
}

function rowKeyGetter(row: Row) {
  return row.id;
}

const columns: readonly Column<Row>[] = [
  SelectColumn,
  {
    key: 'id',
    name: 'ID',
    width: 80,
    resizable: true,
    frozen: true
  },
];

function createRows(): Row[] {
  const rows: Row[] = [];

  for (let i = 0; i < 2000; i++) {
    rows.push({
      id: `id_${i}`,
      avatar: "abc",
      email: "abc",
      title: "abc",
      firstName: "abc",
      lastName: "abc",
      street: "abc",
      zipCode:"abc",
      date: "abc",
      bs:"abc",
      catchPhrase: "abc",
      companyName: "abc",
      words: "abc",
      sentence: "abc"
    });
  }

  return rows;
}

export default function DataTable({ direction }: any) {
  const [rows, setRows] = useState(createRows);
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<string>>(() => new Set());

  function handleFill({ columnKey, sourceRow, targetRow }: FillEvent<Row>): Row {
    return { ...targetRow, [columnKey]: sourceRow[columnKey as keyof Row] };
  }

  function handlePaste({
    sourceColumnKey,
    sourceRow,
    targetColumnKey,
    targetRow
  }: PasteEvent<Row>): Row {
    const incompatibleColumns = ['email', 'zipCode', 'date'];
    if (
      sourceColumnKey === 'avatar' ||
      ['id', 'avatar'].includes(targetColumnKey) ||
      ((incompatibleColumns.includes(targetColumnKey) ||
        incompatibleColumns.includes(sourceColumnKey)) &&
        sourceColumnKey !== targetColumnKey)
    ) {
      return targetRow;
    }

    return { ...targetRow, [targetColumnKey]: sourceRow[sourceColumnKey as keyof Row] };
  }

  function handleCopy({ sourceRow, sourceColumnKey }: CopyEvent<Row>): void {
    if (window.isSecureContext) {
      navigator.clipboard.writeText(sourceRow[sourceColumnKey as keyof Row]);
    }
  }

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      rowKeyGetter={rowKeyGetter}
      onRowsChange={setRows}
      onFill={handleFill}
      onCopy={handleCopy}
      onPaste={handlePaste}
      rowHeight={30}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      className="fill-grid"
      rowClass={(row) => (row.id.includes('7') ? highlightClassname : undefined)}
      direction={direction}
    />
  );
}