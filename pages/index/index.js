// index.js
// 获取应用实例
const app = getApp()
import baseUrl from "../../utils/baseUrl.js"

Page({

  data: {
    value: '',
    password:'',
    username:''
  },

  onChange(event) {
    // event.detail 为当前输入的值
    console.log(event.detail);
  },
  login(){

wx.request({
  url: baseUrl.url+'/user/login',
  data:{
    userAccount:parseInt(this.data.username),
    userPassword:parseInt(this.data.password)
  },
  success:(res)=>{
    console.log(res)

    app.globalData.userId=res.data.data.id
    wx.navigateTo({
      url: '/pages/deviceList/deviceList',
    })

  }
})


   

  }
})
