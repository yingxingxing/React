/*
 * @Description: 
 * @Author: 莲白
 * @Date: 2022-09-23 09:35:52
 * @LastEditTime: 2022-09-24 11:31:00
 * @LastEditors: 莲白
 */
import React,{Suspense,lazy} from 'react';
import { Link,Routes,Route } from 'react-router-dom';
import { Button } from 'antd';
const Home=lazy (()=>import(/*webpackChunkName:'home'*/'./pages/Home')) //路由懒加载
const About=lazy (()=>import(/*webpackChunkName:"about"*/'./pages/About'))//路由懒加载
export default function App(){
return <div>
  <h1>App页面</h1>
  <h1><Home></Home></h1>
  <ul>
    <li>
    <Link to='/home'>Home</Link>
      </li>
      <li>
    <Link to='/about'>About</Link>
      </li>
  </ul>
  <Button type="primary">Primary Button</Button>
  <Suspense fallback={<div>loading.......</div>}>
  <Routes>
    <Route path='/home' element={<Home />}></Route>
    <Route path='/about' element={<About />}></Route>
  </Routes>
  </Suspense>
</div>
}