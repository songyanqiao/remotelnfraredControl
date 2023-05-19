// pages/deviceDetail/deviceDetail.js
import baseUrl from "../../utils/baseUrl.js"
import paho from "../../utils/paho-mqtt-min.js"
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceButtonList: [{
      name: '按钮',
      topic: '/esp8266'
    }, {
      name: '按钮',
      topic: '/esp8266'
    }, {
      name: '按钮',
      topic: '/esp8266'
    }, {
      name: '按钮',
      topic: '/esp8266'
    }, {
      name: '按钮',
      topic: '/esp8266'
    }, {
      name: '按钮',
      topic: '/esp8266'
    }, {
      name: '按钮',
      topic: '/esp8266'
    }, {
      name: '按钮',
      topic: '/esp8266'
    }, {
      name: '按钮',
      topic: '/esp8266'
    }],
    abc: app.globalData.abc
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

this.setData({
  bigButtonId:options.bigButtonId
})
    let topic = app.globalData.topic
    let initCD = new Uint8Array([29, 0, 0, 0, 0, 29])
    this.pahoSend(initCD, topic);


    

  },
  aircondition() {

    wx.navigateTo({
      url: '/pages/aircondition/aircondition',
    })
  },
  buttonSetting() {

    wx.navigateTo({
      url: '/pages/buttonSetting/buttonSetting?bigButtonId='+this.data.bigButtonId,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  onPushMsg: function (res) {

    const infraredControlDataList = baseUrl.infraredControlDataList003
    let topic = app.globalData.topic
    let number = res.currentTarget.dataset.number
    let msg = infraredControlDataList[number]
    this.pahoSend(msg, topic);

   


  },
  pahoSend(modbus, topic) {
    var message = new paho.Message(modbus)
    message.destinationName = topic
    message.qos = 0
    message.retained = false
    app.globalData.client.send(message)
  },

  getSmallButon(bigButtonId){

    var that=this
    wx.request({
      url: baseUrl.url+'/smallButton/getAll',
      data:{
        bigButtonId: bigButtonId
      },
      success:(res)=>{
        
          that.setData({
            deviceButtonList:res.data.data
          })

          wx.showToast({
            title: res.data.message,
          })
      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
    this.getSmallButon(this.data.bigButtonId)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})