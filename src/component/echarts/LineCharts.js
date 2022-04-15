
import * as echarts from 'echarts';
import {useEffect, useState} from "react";
const  defaultData =  [
    { value: 10, name: '程序故障' },
    { value: 7, name: '电器故障' },
    { value: 5, name: '机械故障' },
    { value: 4, name: '其他故障' },
]

export function LineCharts({style,data={},width=150,height=150,wsData}) {


    // const [progress,setProgress] = useState(schedule)
    const [dom,setDom ]= useState(null)
    const [mycharts,setMycharts] = useState(null)
    const chartsId = 'chart'+Date.now()+Math.random()
    let chartDom = null;

    useEffect(() => {
        chartDom = document.getElementById(chartsId);
        setDom(chartDom)
        // setProgress(schedule)
    },[])
    useEffect(() => {
        const option = {
            xAxis: {
                type: 'category',
                data: data.map(n => n.name)
            },
            yAxis: {
                type: 'value'
            },
            grid: {
                top:30,
                left:50,
                right:50,
                bottom:50
            },
            series: [
                {
                    data: data.map(n => n.utilization),
                    type: 'line'
                }
            ]
        };
        console.log(data)
        mycharts?.setOption(option)
    },[data,mycharts])

    useEffect(() =>{
        if ( !dom ) {
            // console.log(chartDom)
            const myChart = echarts.init(chartDom);
            myChart.resize({ height,width })
            const option = {
                xAxis: {
                    type: 'category',
                    data: data.map(n => n.name)
                },
                yAxis: {
                    type: 'value'
                },
                grid: {
                    top:30,
                    left:50,
                    right:50,
                    bottom:50
                },
                series: [
                    {
                        data: data.map(n => n.utilization),
                        type: 'line'
                    }
                ]
            };
            setMycharts(myChart)
            myChart.setOption(option)
        }
        // console.log(chartDom)
    },[chartDom,data])
    return (
        <>
            <div style={{...style}} id={chartsId}/>
        </>
    )
}
