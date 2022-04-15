import * as echarts from 'echarts';
import {useEffect, useState} from "react";
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
export const getColor  = () => {
    const numone=parseInt(Math.random()*(255+1),10);
    const numtwo=parseInt(Math.random()*(255+1),10);
    const numthree=parseInt(Math.random()*(255+1),10);
    return 'rgb('+numone+','+numtwo+','+numthree+')'
}
let Color = function(color) {
    this.color = color;
    this.instance = null;
}
Color.prototype.getColor = function() {
    return this.color
}
Color.getInstance = function(color) {
    if (this.instance) {
        return this.instance;
    }
    return this.instance = new Color(color);
}


//产生模拟数据

//设定图形效果
function renderItem(params, api) {
    // console.log(api,params)
    var categoryIndex = api.value(0);
    var start = api.coord([api.value(1), categoryIndex]);
    var end = api.coord([api.value(2), categoryIndex]);
    var height = api.size([0, 1])[1] * 0.2;
    // console.log(params,api)
    var rectShape = echarts.graphic.clipRectByRect({
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        height: height
    }, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
    });

    return rectShape && {
        type: 'rect',
        shape: rectShape,
        style: api.style()
    };

}
const getOption = (startTime,categories,data) => (
    {
        //鼠标提示
        tooltip: {
            formatter: function (params) {
                // console.log(params)
                return params.marker + params.data.fullName + ': ' + params.value[3] + ' ms';
            }
        },
        legend: {
            show : true,
            data: ['运行','结束'],
            right: 80,
            top: 10,
            left:'center'
        },

        //缩放
        // dataZoom: [{
        //     type: 'slider',
        //     show : false,
        //     filterMode: 'weakFilter',
        //     showDataShadow: false,
        //     top: 550,
        //     height: 10,
        //     borderColor: 'transparent',
        //     backgroundColor: '#e2e2e2',
        //     handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', //jshint ignore:line
        //     handleSize: 20,
        //     handleStyle: {
        //         shadowBlur: 6,
        //         shadowOffsetX: 1,
        //         shadowOffsetY: 2,
        //         shadowColor: '#aaa'
        //     },
        //     labelFormatter: '',
        //     start: 0,
        //     end: 70,
        // }, {
        //     type: 'inside',
        //     filterMode: 'weakFilter'
        // }],
        grid: {
            top: 50,
            left: 100,
            height: 180
        },
        xAxis: {
            name:'执行时间',
            // min: initTime(startTime),
            scale: true,
            axisLabel: {
                formatter: function (val) {
                    return  initTime(val).split(' ')[1];
                }
            }
        },
        yAxis: {
            name:'机器名称',
            data: categories
        },

        series: [
            {
                name:'运行',
                type: 'custom',
                renderItem: renderItem,
                itemStyle: {
                    opacity: 0.8,
                    color: "#d89e74"
                },
                encode: {
                    x: [1, 2],
                    y: 0
                },
                data: data.filter(n => n.name === '运行')
            },
            {
                name:'结束',
                type: 'custom',
                renderItem: renderItem,
                itemStyle: {
                    opacity: 0.8,
                    normal: {
                        color: "#bd6d6c",
                        borderWidth: 2
                    }
                },
                encode: {
                    x: [1, 2],
                    y: 0
                },
                data:data.filter(n => n.name === '结束')
            },
        ]
    }
)

export function GanttCharts({style,width=150,height=150,orderData={},jobColors={}}) {

    useEffect(() => {
        console.log(orderData)
    },[orderData])
    const initEdgeOrderData = (edgeOrderData) => {
        const proceduresMap = edgeOrderData?.procedureTable?.proceduresMap || {}
        const parallelProcedures = edgeOrderData?.parallelProcedures || {};

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
        const dataWithStatus =  Object.keys(parallelProcedures).map((p,i) => {
            return {
                [p] : parallelProcedures[p].map(n => {
                    return {
                        ...n,
                        status: pStatus[n.procedureFullName]
                    }
                })
            }
        }).reduce((a,b) => ({...a,...b}),{})
        return {
            jobArr,dataWithStatus
        }
    }
    const types = [
        {name: '运行', color: '#75d874'},
        {name: '结束', color: '#bd6d6c'},

    ];
    const startTime = (new Date(orderData.taskStartTime)).getTime();
    const initData = (types,startTime,orderData) => {
        const {jobArr=[],dataWithStatus={}} = Object.keys(orderData).length !== 0 ?  initEdgeOrderData(orderData) : {jobArr:[],dataWithStatus:{}}

        // const jobColor = jobArr.map(n => ({
        //     [n] : getColor()
        // })).reduce((a,b) => ({...a,...b}),{});

        const jobColor = Object.keys(jobColors).length === 0 ? []: jobColors[Object.keys(jobColors)]

        const categories = Object.keys(dataWithStatus);

        const data = Object.keys(orderData).length !== 0 ? categories.map((c,i) => {
            return  dataWithStatus[c].map((m,j) => {
                const b = m.status === 'FINISHED'
                const type = b ? types[1] : types[0]
                return {
                    name:type.name,
                    fullName: m.procedureFullName,
                    value: [
                        i,
                        startTime+m.expectedStartTimeMills,
                        startTime+m.expectedFinishTimeMills,
                        m.expectedFinishTimeMills - m.expectedStartTimeMills
                    ],
                    itemStyle: {
                        normal: {
                            color: !b ? jobColor[m.procedureFullName.split('::')[0]] : '#bd6d6c'
                        }
                    }
                }
            })
        }).flat(1) : []

        return {
            jobArr,
            jobColor,
            categories,
            data
        }
    }

    const [dom,setDom ]= useState(null)

    const [option,setOption] = useState({})
    const [mycharts,setMycharts] = useState(null)

    useEffect(() => {
        const {categories, data} = initData(types, startTime,orderData)
        const o = getOption( +new Date(),categories,data)
        // console.log(data,categories,getOption( +new Date(),categories,data))
        mycharts?.setOption(o)
    },[orderData,mycharts])

    const chartsId = 'chart'+Date.now()+Math.random()
    let chartDom = null;

    useEffect(() => {
        chartDom = document.getElementById(chartsId);
        setDom(chartDom)
    },[])
    useEffect(() =>{
        if ( !dom ) {
            // console.log(chartDom)
            const myChart = echarts.init(chartDom);
            myChart.resize({ height,width })
            setMycharts(myChart)
            myChart.setOption(option)
        }
        // console.log( !dom)
    },[chartDom,orderData])
    return (
        <>
            <div style={{...style}} id={chartsId}/>
        </>
    )
}
