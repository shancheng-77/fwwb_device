import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import {Outlet, Link, useNavigate, useLocation} from 'react-router-dom';
import {router} from "../../routers";
import {createContext, useContext, useEffect, useReducer, useState} from "react";
import {Snackbar} from "@mui/material";
import {fetchGet, historyOrderUrl, noticeWebSocket, orderWebSocket} from "../../requestAddress";
import Button from "@mui/material/Button";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
// 消息条相关
export const sendMessage = (param) => ({type:'message',payload:param})
function reducer(state, action) {
    const {type,payload} = action;
    if (type === 'message')  {
        return payload
    }
    else {
        return  {
            open:false,
            type:'',
            message :''
        }
    }
}
export const SnackbarContext = createContext({open:true,message:'hello'});

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function Main() {
    // 获取页面初始tab
    const location = useLocation();
    const navigate = useNavigate();
    const initSelectedTab = () => {
        const index =  router.findIndex(n => n.path === location.pathname)
        return [2,3].includes(index) ? 1 : index;
    }
    const [value, setValue] = React.useState(() => initSelectedTab());
    const handleChange = (event, newValue) => {
        // console.log()
        setValue(newValue === 2 ? 1 : newValue);
    };

    // 消息列表的值
    const [snackbar,dispatch] = useReducer(reducer,{
        open:false,
        type:'',
        message :''
    })

    useEffect(() => {
        const socket = new WebSocket(noticeWebSocket);
        socket.addEventListener('message', function (event) {
            let data = JSON.parse(event.data)
            dispatch(sendMessage({open:true,message:data.payload,type:'success'}))
            console.log(data)
        });
        return () => {
            socket.close()
        }
    },[])

    return (
        <Box sx={{ width: '100%',minWidth:1200 }} style={{backgroundColor:'082032'}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider',backgroundColor:'#283A4D',position:'relative'}} >
                <Tabs value={value} onChange={handleChange} centered
                      aria-label="basic tabs example"
                      style={{height:60,lineHeight:60}}
                >
                    {
                        router.map((_, index) => {
                            if (_.item) {
                                return <Tab key={index} label={_.name} value={index}
                                            onClick={() => navigate(_.path)}
                                            style={{height:60,lineHeight:'60px',fontSize:18}}
                                />;
                            }
                        })
                    }
                </Tabs>
                <Button style={{position:"absolute",top:15,right:20}}
                        variant="outlined"
                        onClick={() => navigate('/login')}
                >退出登录</Button>
            </Box>
            <Box sx={{height:620,padding:'20px 50px',backgroundColor:'#162330',display:'flex',justifyContent:'center'}}>
                <Box sx={{width:1100}}>
                    <SnackbarContext.Provider value={{ dispatch }}>
                        <Outlet/>
                    </SnackbarContext.Provider>
                </Box>
            </Box>

            <Snackbar
                anchorOrigin={{ vertical:'top', horizontal:'right' }}
                open={snackbar.open}
                onClose={() => dispatch(sendMessage({open:false,message:'',type:'success'}))}
                autoHideDuration={3000}
                message={snackbar.message}
                key={1}
            >
                <Alert  severity={snackbar.type} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
