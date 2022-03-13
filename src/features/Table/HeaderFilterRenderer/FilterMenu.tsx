import { IconButton, Menu, Grid, Button } from "@mui/material";
import { useState } from "react";
import { filterContext } from ".";
import FilterModel from "../../../Models/FilterModel";
import UploadModel from "../../../Models/UploadModel";
import { InputSwitch } from "./InputSwitch";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { useAppDispatch } from "../../../app/hooks";
import { CsvTableActions } from "../../../reducers/CSVTable/CSVTableSlice";

export function FilterMenu({column}: {column: UploadModel}) {
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const [filterData, setFilterData] = useState<FilterModel | null>({
        key: column.key,
        comparator: "",
        operation: "=="
    })
    const dispatch = useAppDispatch();

    const saveFilters = () => {
        if(filterData?.comparator && filterData?.operation && filterData?.key)
        {
            dispatch(CsvTableActions.UpdateFilterColumns({...filterData}))
        }
    }

    const deleteFilters = () => {
      if(filterData?.operation && filterData?.key)
      {
          dispatch(CsvTableActions.UpdateFilterColumns({...filterData, comparator: undefined} as any));
          setFilterData({
            key: column.key,
            comparator: "",
            operation: "=="
          })
      }
    }
  
    const handleClick = (event: any) => {
      if(!open)
      {
        setAnchorEl(event.currentTarget);
        setOpen(true)
      }
    };
  
    const handleClose = () => {
      setAnchorEl(null);
      setOpen(false)
    };

    return (
      <div style = {{
          position: "absolute",
          right:"0px",
          top:"0px",
          padding: "0px"
        }}>
          <IconButton id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onMouseDown={handleClick}  
          sx = {{
              padding: "0px"
            }}>
        
          <FilterAltOutlinedIcon/>
        </IconButton >
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <Grid container>
            <filterContext.Provider value={{setFilters: setFilterData as any, filters: filterData}}>
              <InputSwitch column={column}/>
              <Grid item xs = {!filterData?.comparator ? 6 : 4}> 
                  <Button onMouseDown={() =>{
                      handleClose()
                      saveFilters()
                    }}>
                      Save
                </Button>
              </Grid>
              {
                !filterData?.comparator ? 
                  null 
                  : 
                  <Grid item xs = {4}> 
                    <Button onMouseDown={() =>{
                        handleClose()
                        deleteFilters()
                      }}>
                        Delete
                  </Button>
                </Grid>
              }
              <Grid item xs = {!filterData?.comparator ? 6 : 4}> 
                  <Button onMouseDown={handleClose}>cancel</Button>
              </Grid>
            </filterContext.Provider>
          </Grid>
        </Menu>
      </div>
    );
  }