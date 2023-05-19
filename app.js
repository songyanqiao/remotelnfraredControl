// app.js
import mqtt from "./utils/mqtt"
var paho = require("./utils/paho-mqtt-min.js");
var client
App({

  data: {

  },
  onLaunch() {
    this.connectPaho()
    let that = this

    this.globalData.client = client
  },
  connectPaho() {
    let that = this
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const second = currentDate.getSeconds();
    
    const datetimeString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    

    client = new paho.Client('wss://mqtt.fzlongcheng.top/mqtt', (Date.now() + '')); //后面这个字符串可以用一个随机字符串方法随机生成
    var connectOptions = {
      //invocationContext: { host: "broker.emqx.io", port: 8084, clientId: 'xcx_wdc_' + util.randomWord(false, 43) },
      timeout: 60,
      //useSSL: true,
      cleanSession: false, //实现QoS>0必须设置为false，代表不清除，是持久会话
      keepAliveInterval: 60,
      reconnect: true, //意外断开之后会重连，第一次1秒后重连，往后每次翻倍直到2分钟，后续保持2分钟
      mqttVersion: 4,
      userName:datetimeString,
      password: '',
      onSuccess: function () {
        that.globalData.mqttState = true
        wx.showToast({
          title: 'title',
          title: '连接成功',
        })

        client.onMessageArrived = function (msg) {
          //所有接收的消息都在这里，相关消息的业务处理都写在这里
          console.log(msg.payloadBytes, msg.topic)
          that.globalData.msg = msg.payloadBytes


          let res = msg.payloadBytes

          if (res.length == 1) {

            if (res[0] == 137) {

              wx.showToast({
                title: '执行成功',
                icon: 'success',
                duration: 2000
              })

            } else if (res[0] == 224) {
              wx.showToast({
                title: '执行失败',
                icon: 'error',
                duration: 2000
              })
            }

          }

        }

      },
      onFailure: function (option) {
        console.log('fail', option)
        that.globalData.mqttState = false
      }
    }
    client.connect(connectOptions)
  },
  //paho发送数据，支持发送16进制buffer
  pahoSend(modbus, topic) {
    var message = new paho.Message(modbus)
    message.destinationName = topic
    message.qos = 0
    message.retained = false
    client.send(message)
  },
  /**将ArrayBuffer转换成字符串*/
  ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },
  /**将16进制转化为ArrayBuffer*/
  string2buffer(str) {
    return new Uint8Array(str.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    })).buffer
  },
  //切换后台断开
  // onHide() {
  //   client.disconnect()
  // },
  // //切换前台重连
  // onShow() {
  //   this.connectPaho()
  // },


  globalData: {
    userInfo: null,
    client: null,
    abc: null,
    msg: null,
    userId: '',
    topic: '111',
    bigButtonId: '',
    mqttState: false,
    options: {
      protocolVersion: 5, //MQTT连接协议版本
      clientId: 'weixinApp',
      clean: false,
      password: '123public',
      port: 8083,
      username: 'admin',
      reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
      connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
      resubscribe: true //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
    }
  }
})