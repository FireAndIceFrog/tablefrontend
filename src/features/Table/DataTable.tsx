import { useCallback, useMemo, useState } from "react";
import DataGrid, { HeaderRenderer, SortIconProps, Column, CopyEvent, FillEvent, PasteEvent, SelectColumn, HeaderRendererProps } from "react-data-grid";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { IconButton } from "@mui/material";
import HeaderFilterRenderer from "./HeaderFilterRenderer";

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
  return props.sortDirection === 'ASC' ? 
      <IconButton aria-label="sorter"  sx = {{
        position: "absolute",
        right:"5px",
        top:"25%",
        padding: "0px"
      }}>

      <KeyboardArrowUpOutlinedIcon/> 
    </IconButton >
    : 
    props.sortDirection === 'DESC' ? 
      <IconButton aria-label="sorter"  sx = {{
        position: "absolute",
        right:"5px",
        top:"25%",
        padding: "0px"
      }}>

        <KeyboardArrowDownOutlinedIcon/>
      </IconButton >
    :
    null
}


export default function DataTable({ rowHeight, onScroll, direction, rows, columns, sortColumns, onRowsChange, onSortChange }: any) {
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<string>>(() => new Set());
  function handleFill({ columnKey, sourceRow, targetRow }: FillEvent<any>): any {
    return { ...targetRow, [columnKey]: sourceRow[columnKey as any] };
  }

  const memoizedCols = useMemo(() => {
    const colWithFilters = ([SelectColumn, ...columns]).map((col, index) => {
      if(index === 0) return col;
      const newCol = Object.assign({}, col)
      newCol.headerRenderer = HeaderFilterRenderer
      return newCol;
    })

    return colWithFilters
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
      rowHeight={rowHeight}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      className="fill-grid"
      rowClass={(row) => (undefined)}
      direction={direction}
      enableVirtualization={true}
      components={{
        sortIcon
      }}
      onScroll={onScroll}

    />
  );
}