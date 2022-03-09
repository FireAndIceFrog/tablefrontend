import { Button } from "@mui/material";
import { GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import ClearAllData from "../ClearDataButton";
import DownloadButton from "../RefreshButton";
import SaveButton from "../SaveButton";
import { UploadButton } from "../UploadButton/UploadButton";

const buttonMargins = "0.3%"
export default function Toolbar() {
  return [
        <UploadButton  key = "upload"/>,
        <SaveButton  key = "save"/>,
        <DownloadButton key = "downlaod"/>,
        <ClearAllData  key = "clear"/>
  ];
}
export function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <div >
            
          <GridToolbarExport id="exportButton" variant="outlined" size="medium"/>
          {Toolbar().map((x, i) => <div style={{marginLeft: buttonMargins}} key = {i}>{x}</div>)}
      </div>  
      
      
    </GridToolbarContainer>
  );
}