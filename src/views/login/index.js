
import {Button, TextField} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import logoImgUrl from '../../static/logo (1).png'
import {InputWithLabel} from "../../component/equipment";
export function Login() {
    const navigate = useNavigate()
    const [nameValue,setNameValue] = useState('');
    const [pwdValue,setPwdValue] = useState('')
    const handleClick = () => {
        // console.log(1)
      if (nameValue === 'edge0' && pwdValue === '123456') {
          navigate('/equipment')
      }else {
          alert('账户或密码错误')
      }
    }
    return (
        <>
            <div style={{width:'100%',height:680,display:"flex",justifyContent:"center",alignItems:'center',backgroundColor:'#1b2836',flexDirection:"column"}}>
                <img style={{marginBottom:30}} src={logoImgUrl} width={180}/>
                <div>
                    <InputWithLabel name={'账户'} style={{color:'#eee',width:300}}>
                        <TextField id="outlined-basic" label="账户"
                                   size='small' variant="outlined"
                                   color='primary' sx={{width:300}}
                                   value={nameValue}
                                   onChange={(event) => {
                                       setNameValue(event.target.value)
                                   }}
                        />
                    </InputWithLabel>
                    <InputWithLabel name={'密码'} style={{color:'#eee',width:300,marginTop:30}}>
                        <TextField id="outlined-basic" label="密码"
                                   size='small' variant="outlined"
                                   color='primary' sx={{width:300}}
                                   value={pwdValue}
                                   type={'password'}
                                   onChange={(event) => {
                                       setPwdValue(event.target.value)
                                   }}
                        />
                    </InputWithLabel>
                    <div style={{textAlign:"center",marginTop:30}}>
                        <Button style={{width:250}}  variant="outlined"
                                onClick={handleClick}
                        >登录</Button>
                    </div>
                </div>
            </div>
        </>
    )
}
