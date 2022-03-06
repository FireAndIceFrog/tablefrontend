import { Grid, MenuItem, Paper, Select, Stack } from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import style from "./style.module.css"
import { useDispatch } from "react-redux";
import { TableLookupSliceActions } from "../../reducers/TableLookupSlice/TableLookupSlice";

function HeadersSelect(props: {
    onMappingChange: (header: string, map: string) => void,
    index: number,
    currHeader: string,
}) 
{
    const headers = useAppSelector(s => s.TableLookup.headerOptions);
    const headersMap = useAppSelector(s => s.TableLookup.HeadersMap);


    return <Select
    labelId={`${props.currHeader}_map_${props.index}`}
    value={headersMap ? headersMap[props.currHeader] : "none"}
    label="Age"
    onChange={(x) => {
        if(x.target.value) 
        {
            props.onMappingChange(props.currHeader, x.target.value);
        }
    }}
    >
        {
            headers?.map((header, index) => {
                return <MenuItem key={index} value={header}>{header}</MenuItem>
            })
        }
        <MenuItem key={"No_Item"} value={"none"}>None</MenuItem>
    </Select>
}

export default function HeadersCompareTable()
{
    const dispatch = useDispatch();
    const headersMap = useAppSelector(s => s.TableLookup.HeadersMap);
    if(!headersMap)
    {
        return null;
    }

    const HeaderMappings = Object.entries(headersMap);
    const onMappingChange = (header: string, map: string) => {
        dispatch(TableLookupSliceActions.updateKey({key: header, value: map}));
    };

    return <Grid container spacing={1}>
    {HeaderMappings.map( ([header, mapping], index) => {
        return <Grid key = {`stack_${index}`} item container spacing={1} xs = {12} >
                
                    <Grid key = {`${header}_${index}`} item xs= {5}>
                        <Paper elevation={0}>
                            <Paper elevation={1} sx ={{
                                borderRadius: "5px",
                                border: "1px solid #b0b0b0",
                                width: "fit-content",
                                padding: "10px",
                                boxShadow: "0px 0px 0px #e0e0e0",
                            }}>
                                {header}
                            </Paper>
                        </Paper>
                    </Grid>
                    <Grid key = {`dash_${index}`} item xs= {2}>
                        <Paper elevation={0}>
                            {"->"}
                        </Paper>
                    </Grid>
                    <Grid key = {`mapping_${index}`} item >
                        <Paper elevation={0}>
                            <HeadersSelect
                                index = {index}
                                currHeader = {header}
                                onMappingChange = {onMappingChange}
                            ></HeadersSelect>
                        </Paper>
                    </Grid>
                    
                <Grid key = {`stack_${index}_DIVIDER`} item xs = {12} >
                    <Divider></Divider>
                </Grid>
            </Grid>
    })}
    </Grid>
}