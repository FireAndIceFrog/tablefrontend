import { Grid, Typography, Select, MenuItem, Input } from "@mui/material";
import { useContext, useState } from "react";
import { filterContext } from ".";
import FilterModel from "../../../Models/FilterModel";
import UploadModel from "../../../Models/UploadModel";

export function NumberInput({ column }: {column: UploadModel})
{
  const [open, setOpen] = useState(false);
  const { filters, setFilters } = useContext(filterContext)

  const handlFilterChange = (operation?:FilterModel["operation"], comparator?: FilterModel["comparator"] ) => {
    const newFilter = {
      operation: operation ?? filters?.operation,
      comparator: comparator ?? filters?.comparator,
      key: filters?.key
    } 
    setFilters(newFilter as any)
  }
  const handleOperationChange = (event: any) => {
    handlFilterChange(event.target.getAttribute("data-value"));
    setOpen(false)
  };

  const handleValueChange = (event: any) => {
    handlFilterChange(undefined, event.target.value);
    setOpen(false)
  };

  const handleClose = () => {
    !!open && setOpen(false);
  };

  const handleOpen = () => {
    !open && setOpen(true);
  };

  return <>
    <Grid item xs = {2} key="text"> 
      <Typography paddingLeft="10%">
      Col is 
      </Typography>
    </Grid>
    
    <Grid item xs = {6} key="select" > 
      <Select
        labelId="action-selector-input"
        id="action-selector-input"
        value={filters?.operation}
        label="Operation"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        onChange={()=>undefined}
        variant="standard"
        sx={{width: "80%"}}
      >
        <MenuItem value={"=="} key={"=="} onMouseDown={handleOperationChange}>equal to</MenuItem>
        <MenuItem value={">"} key={">"} onMouseDown={handleOperationChange}>greater than</MenuItem>
        <MenuItem value={"=<"} key={"=<"} onMouseDown={handleOperationChange}>greater than or equal to</MenuItem>
        <MenuItem value={"<"} key={"<"} onMouseDown={handleOperationChange}>less than</MenuItem>
        <MenuItem value={"=>"} key={"=>"} onMouseDown={handleOperationChange}>less than or equal to</MenuItem>
      </Select>
    </Grid>
    <Grid item xs = {4} key="value"> 
      <Input type={column.type} 
        value={filters?.comparator ?? ""}
        onChange={handleValueChange}
        sx={{width: "80%"}}></Input>
    </Grid>
  </>
}