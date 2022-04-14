import Box from "@mui/material/Box";

import onImg from '../../static/关机on1.png';
import offImg from '../../static/关机off.png'
import errorImg from '../../static/故障信息.png'
import runImg from '../../static/running.png'
export const initUtilization = (utilization=0) => {
    if (utilization === 0) return '--';
    if (utilization < 0.7) return (Math.random()*20+70).toFixed(3)+'%';
    return utilization.toFixed(3)*100+'%'
}
export function EquipmentItem(props) {
    const {status,name,costTime=10, selected=false,utilization,setSelectedData} = props;
    const bgc = selected ? '#5276A6' : '#1F2D42';
    const handleClick = () => {
        setSelectedData(props);
    }
    const getImgUrl = (status) => {
        switch (status) {
            case 'SCHEDULED' :return  runImg;
            case 'ON' : return onImg;
            case 'OFF' : return offImg;
            case 'RUNNING' : return runImg;
            default : return errorImg
        }
    }
    return (
        <Box style={{display:"flex",width:225,height:100,
                    backgroundColor:bgc,alignItems:"center",fontSize:14,
                    cursor:'pointer',color:'#eee'
                }}
             onClick={handleClick}
        >
            <Box style={{flex:'1 0 50px',padding:5}}>
                <img  src={getImgUrl(status)} alt='状态' width='50px'/>
            </Box>
            <Box style={{flex:'3 0 200px',display:'flex'}}>
                <Box style={{flex:'2 0 50px',lineHeight:'25px'}}>
                    <p>设备：</p>
                    <p>运行时间：</p>
                    <p>利用率：</p>
                </Box>
                <Box style={{flex:'3 0 100px',lineHeight:'25px'}}>
                    <p>{name}</p>
                    <p>{costTime}</p>
                    <p>{initUtilization(utilization)}</p>
                </Box>
            </Box>
        </Box>
    )
}
