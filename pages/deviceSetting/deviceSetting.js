// pages/deviceSetting/deviceSetting.js
import baseUrl from "../../utils/baseUrl.js"
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    device03: '',
    device04: '',
    device02: '',
    device01: '',
    deviceListData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDeviceId()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  changeData(res){


    this.data.deviceListData[res.currentTarget.dataset.index].name=res.detail
// this.setData({
//   this.data.deviceListData[res.currentTarget.dataset.index].name:res.detail
// })


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  concernEdit() {




var that=this




    for(let i=0;i<this.data.deviceListData.length;i++){
      wx.request({
        url: baseUrl.url + '/bigButton/modify',
        method: "POST",
        header:{
          "content-type":'application/x-www-form-urlencoded',
        },
        data: {
          id: that.data.deviceListData[i].id,
          newName: that.data.deviceListData[i].name
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

  getDeviceId() {

    var that = this
    wx.request({
      url: baseUrl.url + '/user/getAll',
      data: {
        userId: app.globalData.userId
      },
      success: (res) => {
        console.log(res)
        that.setData({
          deviceListData: res.data.data
        })


      }
    })
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