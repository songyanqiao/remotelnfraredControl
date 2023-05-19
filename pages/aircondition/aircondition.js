// pages/aircondition/aircondition.js
import Notify from '@vant/weapp/notify/notify';
import baseUrl from "../../utils/baseUrl.js"
import paho from "../../utils/paho-mqtt-min.js"
var app = getApp()

import {
  temperatureCommands,
  stateDevice,
  modeCommands,
} from "../../utils/baseUrl.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {

    isOpen: false,
    temperature: 20,
    mode: '自动',
    windSpeed: '自动',
    autoScavenging: '开启',

    modeList: [
      '自动', '制冷', '除湿', '送风', '制热',
    ],
    windSpeedList: [
      '自动', '低风', '中风', '强风',
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    Notify({
      message: '请注意当前显示的数据并不是空调的真实状态',
      color: '#ad0000',
      background: '#ffe1e1',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  airconditionSetting() {
    wx.navigateTo({
      url: '/pages/airconditionSetting/airconditionSetting',
    })
  },
  // 开启空调
  open() {
    
    this.setData({
      isOpen: true
    })

    this.pahoSend(stateDevice[0], app.globalData.topic);
  },
  // 关闭空调
  close() {
    this.setData({
      isOpen: false
    })
    this.pahoSend(stateDevice[1], app.globalData.topic);
  },
  changeMode(e) {
    if (!this.data.isOpen) {
      return 0
    }
    let mode = e.currentTarget.dataset.name
    let index = e.currentTarget.dataset.index
    this.setData({
      mode: mode
    })
    this.pahoSend(modeCommands[index], app.globalData.topic);
  },
  changeWindSpeed(e) {
    if (!this.data.isOpen) {
      return 0
    }
    let windSpeed = e.currentTarget.dataset.name
    let index = e.currentTarget.dataset.index
    this.setData({
      windSpeed: windSpeed
    })
    this.pahoSend(modeCommands[index], app.globalData.topic);
  },
  openAutoMode() {
    if (!this.data.isOpen) {
      return 0
    }
    this.setData({
      autoScavenging: '开启'
    })
  },
  closeAutoMode() {
    if (!this.data.isOpen) {
      return 0
    }
    this.setData({
      autoScavenging: '关闭'
    })
  },
  addTemperature() {
    if (!this.data.isOpen) {
      return 0
    }
    if (this.data.temperature < 31) {
      this.setData({
        temperature: this.data.temperature + 1
      })
      this.pahoSend(temperatureCommands[this.data.temperature - 16], app.globalData.topic);
    }
  
  },
  subTemperature() {
    if (!this.data.isOpen) {
      return 0
    }
    if (this.data)
      if (this.data.temperature > 16) {
        this.setData({
          temperature: this.data.temperature - 1
        })
       this.pahoSend(temperatureCommands[this.data.temperature - 16], app.globalData.topic) }
  
  },
  pahoSend(modbus, topic) {
    var message = new paho.Message(modbus)
    message.destinationName = topic
    message.qos = 0
    message.retained = false
    app.globalData.client.send(message)
  },
})