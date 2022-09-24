/*
 * @Description: 
 * @Author: 莲白
 * @Date: 2022-09-23 09:10:09
 * @LastEditTime: 2022-09-23 09:51:30
 * @LastEditors: 莲白
 */
module.exports={
  extends:['react-app'],//继承react官方规则
  parserOptions:{
    babelOptions:{
      presets:[
        //解决页面报错问题
        ['babel-preset-react-app',false],
        'babel-preset-react-app/prod',
      ]
    }
  }
}