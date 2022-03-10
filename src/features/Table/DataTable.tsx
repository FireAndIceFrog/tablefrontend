import { Props, useMemo, useState } from "react";
import DataGrid, { SortIconProps, Column, CopyEvent, FillEvent, PasteEvent, SelectColumn } from "react-data-grid";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

const highlightClassname = `
  .rdg-cell {
    background-color: #9370db;
    color: white;
  }
  &:hover .rdg-cell {
    background-color: #800080;
  }
`;

function rowKeyGetter(row: any) {
  return row["_id"];
}
function sortIcon(props: SortIconProps){
  return props.sortDirection === 'ASC' ? <KeyboardArrowUpOutlinedIcon/> 
  : 
  props.sortDirection === 'DESC' ? <KeyboardArrowDownOutlinedIcon/>
  :
  null
}
export default function DataTable({ direction, rows, columns, sortColumns, onRowsChange, onSortChange }: any) {
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<string>>(() => new Set());

  function handleFill({ columnKey, sourceRow, targetRow }: FillEvent<any>): any {
    return { ...targetRow, [columnKey]: sourceRow[columnKey as any] };
  }

  const memoizedCols = useMemo(() => {
    return [SelectColumn, ...columns]
  }, [columns])

  return (
    <DataGrid
      sortColumns={sortColumns}
      onSortColumnsChange={onSortChange}
      columns={memoizedCols}
      rows={rows}
      rowKeyGetter={rowKeyGetter}
      onRowsChange={onRowsChange}
      onFill={handleFill}
      rowHeight={30}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      className="fill-grid"
      rowClass={(row) => (undefined)}
      direction={direction}
      enableVirtualization={true}
      components={{
        sortIcon
      }}
    />
  );
}