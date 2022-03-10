import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@mui/styles';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { createTheme } from '@mui/material';
import { useMemo } from 'react';
import { Resizable } from 're-resizable';
import { Direction, width } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const styles = (theme: any) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  GridHeaderCell: {
    resize: "horizontal"
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      ...(theme.direction === 'rtl' && {
        paddingLeft: '0 !important',
      }),
      ...(theme.direction !== 'rtl' && {
        paddingRight: undefined,
      }),
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: "#f1f1f1",
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  }
});


function getRowClassName(this: any, { index, props }: any) {
  const { classes, onRowClick }: any = this?.props;

  return clsx(classes.tableRow, classes.flexContainer, {
    [classes.tableRowHover]: index !== -1 && onRowClick != null,
  });
};

function cellRenderer(this: any, { cellData, columnIndex, props }: any) {
  const { columns, classes, rowHeight, onRowClick }: any = this?.props;
  return (
    <TableCell
      component="div"
      className={clsx(classes.tableCell, classes.flexContainer, {
        [classes.noClick]: onRowClick == null,
      })}
      variant="body"
      style={{ height: rowHeight }}
      align={
        (columnIndex != null && columns[columnIndex].numeric) || false
          ? 'right'
          : 'left'
      }
    >
      {cellData}
    </TableCell>
  );
};

function headerRenderer(this: any, { label, columnIndex, width, height, onResize }: any) {
  const { headerHeight, columns, classes }: any = this?.props;
  
  return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.tableRowHover)}
        variant="head"
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
      <Resizable
        size = {{
          width,
          height
        }}
        onResizeStop={(...args: any[]) => {onResize(width, columnIndex, ...args)}}
        enable = {{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false
      }}>
        <span className={classes.GridHeaderCell}>{label}</span>
        <svg style={{
          width:"24px", 
          height:"100%",
          right: "-10px",
          top: "0px",
          position: 'absolute'
        }} viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
      </svg>
    </Resizable>
      </TableCell>
  );
};

function MuiVirtualizedTable(props: any) {
    const { onResizeHeader, classes, columns, rowHeight, headerHeight, ...tableProps }: any = props;
    const [size, setSize] = React.useState({
      width: 0,
      height: 0
    });
    const $this = useMemo(() => ({
      getRowClassName: getRowClassName.bind({ props, ...size }),
      headerRenderer: headerRenderer.bind({ props, ...size }),
      cellRenderer: cellRenderer.bind({ props, ...size }),
    }), [props, size]);
    const tableRef = React.useRef<any>();
    
    React.useLayoutEffect(() => {
      const width = columns.reduce((acc: number, col: any)=> {acc += col.width; return acc}, 0)
      if(size.width !== width){
        setSize((prev) => ({...prev, width}));
        tableRef.current.Grid.state.needToResetStyleCache = true
        tableRef.current.Grid.forceUpdate()
        tableRef.current.forceUpdate()
      }
    }, [columns, size.width])
    
    return (
    <Paper elevation={3} style={{width: size.width}}>
            <Table
              id={`Table_${size.width}`}
              height={800}
              rowHeight={rowHeight}
              gridStyle={{
                direction: 'inherit',
              }}
              ref={tableRef}
              width={size.width}
              headerHeight={headerHeight}
              className={classes.table}
              {...tableProps}
              rowClassName={$this.getRowClassName}
              
            >
              {columns.map(({ dataKey, ...other }: any, index: any) => {
                return (
                  <Column
                    key={dataKey}
                    headerRenderer={(headerProps) =>
                      $this.headerRenderer({
                        ...headerProps,
                        columnIndex: index,
                        width: other.width,
                        height: headerHeight,
                        onResize: onResizeHeader
                      })
                    }
                    flexGrow={4}
                    flexShrink={0}
                    className={classes.flexContainer}
                    cellRenderer={$this.cellRenderer}
                    dataKey={dataKey}
                    {...other}
                    
                  />
                );
              })}
            </Table>
          </Paper>
    );
}

const defaultTheme = createTheme();
const VirtualizedTable = (withStyles(styles as any, { defaultTheme }) as any)(MuiVirtualizedTable);
export default VirtualizedTable;