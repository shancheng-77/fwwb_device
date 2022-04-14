import {CircularProgress} from "@mui/material";
import * as React from "react";

export function Loading({width=100}) {

    return (
        <div style={{width:'100%',height:'100%',display:"flex",
                    justifyContent:'center',alignItems:'center',
                    backgroundColor:'rgba(122,108,108,0.1)'

            }}
        >
            <CircularProgress style={{width:width,height:width,}}/>
        </div>
    )
}
