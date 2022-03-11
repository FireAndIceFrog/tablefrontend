
import { createContext } from "react";
import { HeaderRendererProps, HeaderRenderer } from "react-data-grid";
import FilterModel from "../../../Models/FilterModel";
import { FilterMenu } from "./FilterMenu";

export const filterContext = createContext({setFilters: (data?:FilterModel)=>null , filters: {} as FilterModel | null | undefined})

export default function HeaderFilterRenderer<R, SR, T extends HTMLOrSVGElement>({
  isCellSelected,
  column,
  children,
  ...args
}: HeaderRendererProps<R, SR> & { children: any}) {


  return (
    <>
      <div >
        <div style ={{
          width: "80%",
          position: "absolute",
          left: "9%",
          top:"0%"
        }}>
        <HeaderRenderer
        isCellSelected = {isCellSelected}
        column = {column}
        {...args}/>
        </div>
        <FilterMenu column = {column as any}/>
        
      </div>
    </>
  );
}