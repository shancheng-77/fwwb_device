import * as echarts from 'echarts';
import {useEffect, useState} from "react";

export function ProgressBarChart({style,schedule=0,width=150,height=150}) {

    // const [progress,setProgress] = useState(schedule)
    const [dom,setDom ]= useState(null)
    const [charts,setCharts] = useState(null)
    const chartsId = 'chart'+Date.now()
    let chartDom = null;

    useEffect(() => {
        const option = {
            title: [{
                text:schedule+'%',
                x: 'center',
                y: 'center',
                // top: '47%',
                textStyle: {
                    fontSize: '20',
                    color: '#a9a8a8',
                    fontFamily: 'DINAlternate-Bold, DINAlternate',
                    fontWeight: '600',
                },
            }],

            polar: {
                radius: ['0%', '150%'],
                center: ['50%', '50%'],
            },
            angleAxis: {
                max: 100,
                clockwise: false, // 逆时针
                // 隐藏刻度线
                show: false,
                startAngle: 90, // startAngle表示起始角度
            },
            grid: {
                top:'10px',
                left:'10px',
                right:'10px',
                bottom:'10px'
            },
            radiusAxis: {
                type: 'category',
                show: true,
                axisLabel: {
                    show: false,
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
            },
            series: [
                {
                    name: '',
                    type: 'bar',
                    //roundCap: true,
                    barWidth: '14%',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(66, 66, 66, .3)',
                    },
                    data:[schedule],
                    coordinateSystem: 'polar',

                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                            {
                                offset: 0,
                                color: '#3196fa',
                            },
                            {
                                offset: 1,
                                color: '#3196fa',
                            },
                        ]),
                    },
                }
            ],

        }
        charts?.setOption(option)
    },[charts,schedule])
    useEffect(() => {
        chartDom = document.getElementById(chartsId);
        setDom(chartDom)
        // setProgress(schedule)
    },[])
    useEffect(() =>{
        if ( !dom ) {
            // console.log(chartDom)
            const myChart = echarts.init(chartDom);
            setCharts(myChart)
            const option = {
                title: [{
                    text:schedule+'%',
                    x: 'center',
                    y: 'center',
                    // top: '47%',
                    textStyle: {
                        fontSize: '20',
                        color: '#a9a8a8',
                        fontFamily: 'DINAlternate-Bold, DINAlternate',
                        fontWeight: '600',
                    },
                }],

                polar: {
                    radius: ['0%', '150%'],
                    center: ['50%', '50%'],
                },
                angleAxis: {
                    max: 100,
                    clockwise: false, // 逆时针
                    // 隐藏刻度线
                    show: false,
                    startAngle: 90, // startAngle表示起始角度
                },
                grid: {
                    top:'10px',
                    left:'10px',
                    right:'10px',
                    bottom:'10px'
                },
                radiusAxis: {
                    type: 'category',
                    show: true,
                    axisLabel: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                },
                series: [
                    {
                        name: '',
                        type: 'bar',
                        //roundCap: true,
                        barWidth: '14%',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(66, 66, 66, .3)',
                        },
                        data:[schedule],
                        coordinateSystem: 'polar',

                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                {
                                    offset: 0,
                                    color: '#3196fa',
                                },
                                {
                                    offset: 1,
                                    color: '#3196fa',
                                },
                            ]),
                        },
                    }
                ],

            }
            myChart.resize({ height,width })
            myChart.setOption(option)
        }
        // console.log(chartDom)
    },[chartDom])
    return (
        <>
            <div style={{...style}} id={chartsId}/>
        </>
    )
}
