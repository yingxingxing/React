/*
 * @Description: 
 * @Author: 莲白
 * @Date: 2022-09-23 09:32:50
 * @LastEditTime: 2022-09-24 11:38:27
 * @LastEditors: 莲白
 */
//项目入口文件
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App'
import 'antd/dist/antd.less';
const root =ReactDOM.createRoot(document.getElementById('app'))
root.render(<BrowserRouter><App/></BrowserRouter>)