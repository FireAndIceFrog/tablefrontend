import { Button } from "@mui/material";
import { GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import ClearAllData from "../ClearDataButton";
import DownloadButton from "../RefreshButton";
import SaveButton from "../SaveButton";
import { UploadButton } from "../UploadButton/UploadButton";
const buttonMargins = "0.3%"
export function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <div >
              
            <GridToolbarExport id="exportButton" variant="outlined" size="medium"/>
        
        </div>  
        <div style={{marginLeft: buttonMargins}}>
            <UploadButton/>
        </div>
        <div style={{marginLeft: buttonMargins}}>
            <SaveButton/>
        </div>
        <div style={{marginLeft: buttonMargins}}>
            <DownloadButton/>
        </div>
        <div style={{marginLeft: buttonMargins}}>
          <ClearAllData/>
        </div>
        
      </GridToolbarContainer>
    );
  }