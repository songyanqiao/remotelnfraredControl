// pages/deviceList/deviceList.j
import baseUrl from "../../utils/baseUrl.js"
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    deviceListData: [],
    mqttState: false,
    userId:''
  },

  onLoad(options) {

    this.setData({
      mqttState: app.globalData.mqttState,
      userId: app.globalData.userId
    })

  },
  control() {
    wx.navigateToMiniProgram({
      appId: 'wxf2b3a0262975d8c2',
      path: '/pages/live/live?accessToken=at.cnmsug8m5lhgkrl65wgsk8braee0ki6v-1aofa88g8g-16ag8hc-intvey5mq' + '&deviceSerial=L08132488'  + '&channelNo=1' 
    })


  },
  onShow() {
    var that = this
    wx.request({
      url: baseUrl.url + '/user/getAll',
      data: {
        userId: app.globalData.userId
      },
      success: (res) => {
        let deviceListData = res.data.data
        that.setData({
          deviceListData: res.data.data
        })

        for (let i = 0; i < deviceListData.length; i++) {
          app.globalData.client.subscribe(deviceListData[i].topic + '/Pub', {
            qos: 0
          });
          app.globalData.client.subscribe(deviceListData[i].topic + '/Sub', {
            qos: 0
          });
        }

        wx.showToast({
          title: res.data.message,
        })
      }
    })
  },

  deviceDetail(res) {

    console.log(res)
    app.globalData.topic = res.currentTarget.dataset.topic + '/Pub'
    console.log(app.globalData.topic)
    wx.navigateTo({
      url: '/pages/deviceDetail/deviceDetail?bigButtonId=' + res.currentTarget.dataset.bigbuttonid,
    })

    app.globalData.bigbuttonid = res.currentTarget.dataset.bigbuttonid
  },
  deviceSetting() {

    wx.navigateTo({
      url: '/pages/deviceSetting/deviceSetting',
    })
  },
  onUnload() {

  },


})