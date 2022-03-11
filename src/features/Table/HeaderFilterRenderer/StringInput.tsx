import { Grid, Typography, Select, MenuItem, Input } from "@mui/material";
import { useContext, useState } from "react";
import { filterContext } from ".";
import FilterModel from "../../../Models/FilterModel";
import UploadModel from "../../../Models/UploadModel";

export function StringInput({ column }: {column: UploadModel})
{
  const { filters, setFilters } = useContext(filterContext)
  
  const handleValueChange = (event: any) => {
    const newFilter = {
        operation: "=?",
        comparator: event.target.value ?? filters?.comparator,
        key: filters?.key
      } 
      setFilters(newFilter as any)
  };

  return <>
    <Grid item xs = {2} key="text"> 
      <Typography paddingLeft="10%">
      Col is 
      </Typography>
    </Grid>
    
    <Grid item xs = {8} key="value"> 
      <Input type={column.type} 
        value={filters?.comparator ?? ""}
        onChange={handleValueChange}
        sx={{width: "80%"}}></Input>
    </Grid>
  </>
}