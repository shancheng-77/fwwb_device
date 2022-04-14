import Box from "@mui/material/Box";
import {ProgressBarChart} from "../echarts/ProgressBarChart";
import * as React from "react";
import {GanttCharts, getColor} from "../echarts/GanttCharts";
import {useCallback, useContext, useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {
    fetchGet,
    historyOrderUrl,
    taskWebSocket
} from "../../requestAddress";
import {sendMessage, SnackbarContext} from "../../views/main";
import {EdgeOrderItem} from "./EdgeOrderItem";
import {Loading} from "../loading";
// 对时间进行格式化
export const getTime = (time) => (new Date(time)).getTime();
export const isUndefined = (value) => (value === void 0)
// 历史订单和正在进行订单格式不一样
export const initTime = (time) => {
    const a = (number) => {
        if (number < 10) {
            return '0' +number
        }
        return number
    }
    if (!isUndefined(time)) {
        let date = new Date(time);
        let year = date.getFullYear();
        let month = a(date.getMonth()+1);
        let day = a(date.getDay());

        let hour = a(date.getHours());
        let minutes = a(date.getMinutes());
        let seconds = a(date.getSeconds());

        return year+'-'+month+'-'+day+' '+hour+':'+minutes+':'+seconds;
    }
    return  '--'
}
const getJobColor = (edgeOrderData) => {
    const proceduresMap = edgeOrderData?.procedureTable?.proceduresMap || {}

    const pStatus = Object.keys(proceduresMap).map((p,i) => {
        return proceduresMap[p].map((n,j) => {
            const name = p+'::'+n.name;
            return {
                [name]: n.status
            }
        })
    }).flat(1).reduce((a,b) => ({...a,...b}),{})
    // console.log(pStatus)
    const jobArr = Object.keys(pStatus).map(n => n.split('::')[0])

    return jobArr.map(n => ({
        [n] : getColor()
    })).reduce((a,b) => ({...a,...b}),{});
}
export function EdgeOrder() {
    const [pendingEdgeOrder,setPendingEdgeOrder] = useState([]);
    const [historyEdgeOrder,setHistoryEdgeOrder] = useState([]);
    const [selectedItemInfo,setSelectedItemInfo] = useState({});
    const [selectedItemID,setSelectedItemId] = useState(0);
    const [isChart,setIsChart] = useState(true);

    const [jobColor,setJobColor] = useState({});
    const [progress,setProgress] = useState(0)
    const {state} = useLocation();
    const {dispatch} = useContext(SnackbarContext)
    const getOrderProgress = (orderInfo) => {
        const proceduresMap = orderInfo?.procedureTable?.proceduresMap || {};
        const arr = Object.values(proceduresMap).map(n => {
            let i = (n.filter(a => a.status === 'FINISHED').length / n.length).toFixed(2)
            return parseFloat(i)
        })
        return  (arr.filter(n => n === 1).length / arr.length*100).toFixed(0)
    }
    // websocket
    useEffect(() => {
        const socket = new WebSocket(taskWebSocket);
        let job = {}
        socket.addEventListener('message', function (event) {
            let data = JSON.parse(event.data)
            // console.log(data)
            if (data.code === 500) {
                dispatch(sendMessage({open:true,message:data.message,type:'error'}))
            }
            else {
                // 在websocket结束时候请求一次历史订单
                if (data.payload.length === 0) {
                    fetchGet(historyOrderUrl).then((res) => {
                        const data = res.payload.reverse();
                        setIsChart(true)
                        setHistoryEdgeOrder(data)
                        setSelectedItemInfo(data[0]);
                        setSelectedItemId(data[0].taskCode)
                    })
                }
                // 不显示甘特图
                setIsChart(data.payload[0]?.taskStatus === 'PROCESSING')

                setPendingEdgeOrder(data.payload);
                setSelectedItemId(data.payload[0]?.taskCode)
                setSelectedItemInfo(data.payload[0]);

                // 为该订单生成唯一色卡
                if (!job[data.payload[0].taskCode]) {
                    job = {
                        [data.payload[0].taskCode] : getJobColor(data.payload[0])
                    }
                }
                setJobColor(job)
            }
        });
        return () => {
            socket.close()
        }
    },[])

    useEffect(() => {
        // console.log(getOrderProgress(selectedItemInfo))
        setProgress(() => getOrderProgress(selectedItemInfo))
    },[selectedItemInfo])
    // 在页面初始化时候请求历史订单数据
    useEffect(() => {
        fetchGet(historyOrderUrl).then((res) => {
            const data = res.payload.reverse();

            setIsChart(true)
            setHistoryEdgeOrder(data)
            setSelectedItemInfo(data[0]);
            setSelectedItemId(data[0].taskCode)
        })
    },[])

    // useEffect(() => {
    //     console.log(getEdgeOrderList())
    // },[pendingEdgeOrder,historyEdgeOrder])

    const getEdgeOrderList = useCallback(() => {
        return [
            ...pendingEdgeOrder,
            ...historyEdgeOrder
        ]
    },[pendingEdgeOrder,historyEdgeOrder])

    return (
        <>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)"  style={{height:570}} gap={2}>

                <Box gridColumn="span 3" style={{backgroundColor:'#AFBED0',padding:10, borderRadius:5,position:'relative',height:570,overflowY:'auto'}}>
                    {
                        getEdgeOrderList().length === 0 ? <Loading width={80}/> :
                            getEdgeOrderList().map((e,i) => {
                                return <EdgeOrderItem
                                    key={e.taskCode}
                                    edgeOrderData={e}
                                    setOrderID={setSelectedItemId}
                                    setThisOrderInfo={setSelectedItemInfo}
                                    selected={selectedItemID === e.taskCode}
                                />
                            })
                    }
                </Box>
                <Box gridColumn="span 9"  style={{backgroundColor:'#AFBED0',padding:10, borderRadius:5}}>
                    <div style={{backgroundColor:'rgb(177 203 226)',height:213}}>
                        {
                            !selectedItemInfo ? <Loading width={50}/> :
                                <>
                                    <p style={{height:30,padding:'5px 20px',lineHeight:'30px',backgroundColor:'#283A4D'}}>
                                        订单编号：{selectedItemID}
                                    </p>
                                    <div style={{display:'flex',justifyContent:"space-between",alignItems:"center",padding:20,height:133}}>
                                        <ul style={{paddingLeft:50}}>
                                            <li style={{height:40,lineHeight:'40px'}}>开始时间：{selectedItemInfo?.taskStartTime ? initTime(getTime(selectedItemInfo.taskStartTime)): '--'}</li>
                                            <li style={{height:40,lineHeight:'40px'}}>结束时间：{selectedItemInfo?.taskFinishTime ? initTime(getTime(selectedItemInfo.taskFinishTime)):'--'}</li>
                                        </ul>
                                        <div style={{marginRight:150}}>
                                            <ProgressBarChart schedule={progress} />
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
                    <div style={{ width: '100%',marginTop:20,height:330,overflowY:'auto',backgroundColor:'rgb(177 203 226)',position:"relative"}}>
                        <p style={{height:30,padding:'5px 20px',lineHeight:'30px',backgroundColor:'#283A4D'}}>
                            订单工序流程
                        </p>
                        {
                            isChart && selectedItemInfo ? <GanttCharts width={760} height={280} orderData={selectedItemInfo} jobColors={jobColor}/> :
                                <Loading width={50}/>

                        }
                    </div>
                </Box>
            </Box>
        </>
    )
}
