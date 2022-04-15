import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {router} from "./routers";
import {Main} from "./views/main";
import {Login} from "./views/login";
export function AppWithRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />
                <Route
                    path="/login"
                    element={<Login/>}
                />
                <Route path='/' element={<Main/>} >
                    {router.map(route => {
                        // console.log(route.component)
                        return (
                            <Route path={route.path} element={route.component} key={route.path}/>
                        )
                    })}
                </Route>
                <Route
                    path="/*"
                    element={<Navigate to="/equipment" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

