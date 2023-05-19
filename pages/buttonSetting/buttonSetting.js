// pages/buttonSetting/buttonSetting.js
import baseUrl from "../../utils/baseUrl.js"
import paho from "../../utils/paho-mqtt-min.js"
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceStudyButtonList:[
      {
        name:'开关机',
        topic:'/esp8266'
      }, {
        name:'开关机',
        topic:'/esp8266'
      }, {
        name:'开关机',
        topic:'/esp8266'
      }, {
        name:'开关机',
        topic:'/esp8266'
      }, {
        name:'开关机',
        topic:'/esp8266'
      }, {
        name:'开关机',
        topic:'/esp8266'
      }, {
        name:'开关机',
        topic:'/esp8266'
      }, {
        name:'开关机',
        topic:'/esp8266'
      }, {
        name:'开关机',
        topic:'/esp8266'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // const infraredStudyDataList = baseUrl.infraredStudyDataList
    // this.pahoSend(infraredStudyDataList[0], '/esp8266');
         console.log(options)
      this.getSmallButon(options.bigButtonId)
  },
  changeData(res){
    console.log(res)
    this.data.deviceStudyButtonList[res.currentTarget.dataset.index].name=res.detail
// this.setData({
//   this.data.deviceListData[res.currentTarget.dataset.index].name:res.detail
// })
  },
  concernEdit() {
       var that=this
        for(let i=0;i<this.data.deviceStudyButtonList.length;i++){
          wx.request({
            url: baseUrl.url + '/smallButton/modify',
            method: "POST",
            header:{
              "content-type":'application/x-www-form-urlencoded',
            },
            data: {
              id: that.data.deviceStudyButtonList[i].id,
              newName: that.data.deviceStudyButtonList[i].name
            },
            success: (res) => {
              console.log(res)
              wx.showToast({
                title: res.data.message,
              })
              
            }
          })
        }
      },
  getSmallButon(bigButtonId){

    var that=this
    wx.request({
      url: baseUrl.url+'/smallButton/getAll',
      data:{
        bigButtonId: bigButtonId
      },
      success:(res)=>{
        console.log(res)
          that.setData({
            deviceStudyButtonList:res.data.data
          })

          wx.showToast({
            title: res.data.message,
          })
      }
    })

  },
  mqttStudy(res){

  
    const infraredStudyDataList = baseUrl.infraredStudyDataList
    let topic = app.globalData.topic
    let number = res.currentTarget.dataset.number
    let msg = infraredStudyDataList[number]
    console.log(topic,msg)
    this.pahoSend(msg, topic);
  },

  pahoSend(modbus, topic) {
    var message = new paho.Message(modbus)
    message.destinationName = topic
    message.qos = 0
    message.retained = false
    app.globalData.client.send(message)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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