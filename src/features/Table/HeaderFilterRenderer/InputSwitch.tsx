import { Grid, Input, Typography } from "@mui/material";
import { ReactElement } from "react";
import UploadModel from "../../../Models/UploadModel";
import { NumberInput } from "./NumberInput";
import { StringInput } from "./StringInput";


export function InputSwitch({ column }: {column: UploadModel}) {
    let input: ReactElement;
    switch(column.type)
    {
      case "number":
        input = <NumberInput column = {column}/>
        break;
      default:
        input = <StringInput column = {column}/>
    }
    return input
  }