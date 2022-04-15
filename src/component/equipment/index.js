import {useLocation, useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import * as React from "react";
import Grid from "@mui/material/Grid";
import {EquipmentItem, initUtilization} from "./EquipmentItem";
import imgUrl from '../../static/机械.png'
import onImg from '../../static/关机on1.png';
import offImg from '../../static/关机off.png'
import errorImg from '../../static/故障信息.png'
import runImg from '../../static/running.png'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl, InputLabel, MenuItem, Select,
    TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import {deviceWebSocket, edgeWebSocket, fetchPost, sendErrorUrl} from "../../requestAddress";
import {sendMessage, SnackbarContext} from "../../views/main";
import {CateGoryCharts} from "../echarts/CateGoryCharts";
import {LineCharts} from "../echarts/LineCharts";

export const InputWithLabel = (props) => {
    let {children,name,style,alignItems='center'} = props;
    return (
        <div style={{display:'flex',alignItems:alignItems,...style}}>
            <span style={{ textAlign: 'justify',width:80}}>{name}：</span>
            {children}
        </div>

    )
}
const errTypeObject = {
    "程序故障":0,
    "电气故障":1,
    "机械故障":2,
    "其他故障":3
}

export function Equipment() {
    // const {state} = useLocation();
    const [devices,setDevices] = useState([]);

    const [selectedEquipment,setSelectedEquipment] = useState({});

    const [errMessageValue,setErrMessageValue] = useState('');
    const [errType,setErrType] = useState('')

    const [isOpen,setIsOpen] = useState(false);

    const [wsData,setWsData] = useState([])
    const [lineData,setLineData] = useState([])
    const {dispatch} = useContext(SnackbarContext)

    const clickError = () => {
        if (!selectedEquipment.name) {
            alert('请选择设备')
        }else {
            setIsOpen(true)
        }
    }
    const initValue = () => {
        setErrType('');
        setErrMessageValue('')
    }
    const sendErrMessage = async () => {
        const data = new FormData();
        data.append('deviceFullName',selectedEquipment.name);
        data.append('errorMessage',errMessageValue);
        data.append('errorType',errTypeObject[errType])
        const res =await (await fetch(sendErrorUrl,{
            method:'POST',
            body:data
        })).json()
        dispatch(sendMessage({open:true,message:res.message,type:res.code === 200?'success':'error'}))
        // console.log(res)
        setIsOpen(false)
        initValue()
    }
    const handleClose = () => {
        setIsOpen(false)
        initValue()
    }
    // 从websocket获取最新的数据
    useEffect(() => {
        const arr = []
        const socket = new WebSocket(deviceWebSocket);
        socket.addEventListener('message', function (event) {
            let data = JSON.parse(event.data).payload
            // console.log(data)
            // state.deviceTable.devices
            arr.push(data.devices)
            setWsData(arr)
            setDevices(data.devices)
            // setEdgeData(Object.values(data.payload))
        });
        return () => {
            socket.close()
        }
    },[])
    // 设置折线图数据
    useEffect(() => {
        const arr = wsData
            .map(n => n.filter(a => a.name === selectedEquipment.name))
            .flat(1)
            .map(n => ({
                name: n.name,
                utilization: n.utilization
            })).filter(n => n.utilization !== 0).slice(0,7)
        setLineData(arr)
    },[wsData,selectedEquipment])
    return (
        <>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)"  style={{height:570}} gap={2}>
                <Box gridColumn="span 8" style={{backgroundColor:'#AFBED0',padding:10, borderRadius:5,position:'relative',height:570}}>
                    <div style={{display:"flex",height:50,justifyContent:"center",alignItems:"center",marginBottom:10}}>
                        <div style={{display:"flex",height:50,justifyContent:"center",cursor:"pointer",alignItems:"center",marginRight:20}}>
                            <img src={onImg} width={30}/> <span>开机</span>
                        </div>

                        <div style={{display:"flex",height:50,justifyContent:"center",cursor:"pointer",alignItems:"center",marginRight:20}}>
                            <img src={offImg} width={30}/> <span>关机</span>
                        </div>
                        <div style={{display:"flex",height:50,justifyContent:"center",cursor:"pointer",alignItems:"center"}}
                             onClick={clickError}
                        >
                            <img src={errorImg} width={30}/> <span>故障</span>
                        </div>
                    </div>
                    <Box style={{height:300,overflowY:"auto",overflowX:'hidden'}}>
                        <Grid container rowSpacing={1} columnSpacing={2} >
                            {
                                devices.map((d,i) => {
                                    return (
                                        <Grid item xs={4} key={i}>
                                            <EquipmentItem
                                                {...d}
                                                selected={d.name === selectedEquipment.name}
                                                setSelectedData={setSelectedEquipment}
                                            />
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </Box>
                    <Box style={{borderTop:'2px solid black'}}>
                        <div style={{backgroundColor:'rgb(48 63 81)',paddingLeft:10,color:'#eee',marginTop:10,width: 690,textAlign:"left",height:30,lineHeight:'30px',fontSize:14}}>各个设备利用率</div>
                        <CateGoryCharts width={700} height={200} data={devices}/>
                    </Box>
                </Box>
                <Box gridColumn="span 4"  style={{backgroundColor:'#AFBED0',padding:10, borderRadius:5,overflow:'hidden'}}>
                    <Box style={{height:355,display:"flex",justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                        <div style={{backgroundColor:'#eee',padding:5}}>
                            <img width={100} src={imgUrl}/>
                        </div>
                        <h3 style={{borderRadius:5,backgroundColor:'rgb(48 63 81)',color:'#eee',margin:'5px 10px',width:150,textAlign:"center",height:30,lineHeight:'30px'}}>
                            设备实时状态
                        </h3>
                        <div style={{display:'flex',marginTop:10,color:'#020202'}}>
                            <div >
                                <p style={{color:'#020202'}}>设备名称：</p>
                                <p style={{color:'#020202'}}>设备状态：</p>
                                <p style={{color:'#020202'}}>设备利用率：</p>
                            </div>
                            <div>
                                <p style={{color:'#020202'}}>{selectedEquipment?.name || '--'}</p>
                                <p style={{color:'#020202'}}>{selectedEquipment?.status || '--'}</p>
                                <p style={{color:'#020202'}}>{initUtilization(selectedEquipment?.utilization)}</p>
                            </div>
                        </div>
                    </Box>
                    <Box >
                        <div style={{backgroundColor:'rgb(48 63 81)',paddingLeft:10,color:'#eee',marginTop:10,width:325,textAlign:"left",height:30,lineHeight:'30px',fontSize:14}}>设备历史利用率</div>
                        <LineCharts width={350} height={200} data={lineData} />
                    </Box>
                </Box>
            </Box>
            <Dialog open={isOpen} onClose={handleClose}>
                <DialogTitle>输入信息</DialogTitle>
                <DialogContent>
                    <InputWithLabel name={'设备名称'} style={{marginTop:10}}>
                        <TextField id="outlined-basic" label="设备名称"
                                   size='small' variant="outlined"
                                   color='primary' sx={{width:200}}
                                   value={selectedEquipment.name}
                                   disabled
                        />
                    </InputWithLabel>
                    <InputWithLabel name={'错误信息'} style={{marginTop:10}}>
                        <TextField id="outlined-basic" label="错误信息"
                                   size='small' variant="outlined"
                                   color='primary' sx={{width:200}}
                                   value={errMessageValue}
                                   onChange={(event) => {
                                      setErrMessageValue(event.target.value)
                                   }}
                        />
                    </InputWithLabel>
                    <InputWithLabel name={'系统模块'} style={{marginTop:10}}>
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={errType}
                                size='small'
                                label="Age"
                                style={{width:200}}
                                onChange={(e) => {
                                    setErrType(e.target.value)
                                }}
                            >
                                {Object.keys(errTypeObject).map(n => (
                                    <MenuItem value={n} key={n}>{n}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </InputWithLabel>
                </DialogContent>
                <DialogActions>
                    <Button onClick={sendErrMessage}>确定</Button>
                    <Button onClick={handleClose}>取消</Button>
                </DialogActions>
            </Dialog>
        </>
    )

}
