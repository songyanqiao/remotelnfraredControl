// pages/airconditionSetting/airconditionSetting.js
import baseUrl from "../../utils/baseUrl.js"
import paho from "../../utils/paho-mqtt-min.js"
var app = getApp()

let brands = [{
    name: '格力',
    code: '000, 020-039'
  },
  {
    name: '海尔',
    code: '001-019'
  },
  {
    name: '美的',
    code: '040-059'
  },
  {
    name: '长虹',
    code: '060-079'
  },
  {
    name: '志高',
    code: '080-099'
  },
  {
    name: '华宝',
    code: '100-109'
  },
  {
    name: '科龙',
    code: '110-119'
  },
  {
    name: 'TCL',
    code: '120-139'
  },
  {
    name: '格兰仕',
    code: '140-149'
  },
  {
    name: '华凌',
    code: '150-169'
  },
  {
    name: '春兰',
    code: '170-179'
  },
  {
    name: '奥克斯',
    code: '180-199'
  },
  {
    name: '三钻、长风',
    code: '190'
  },
  {
    name: '新科',
    code: '200-209'
  },
  {
    name: '澳柯玛',
    code: '210-229'
  },
  {
    name: '海信',
    code: '230-239'
  },
  {
    name: '飞鹿',
    code: '240-249'
  },
  {
    name: '东宝',
    code: '250-269'
  },
  {
    name: '东新宝',
    code: '260-268'
  },
  {
    name: '新飞',
    code: '270-279'
  },
  {
    name: 'GLEE',
    code: '280'
  },
  {
    name: 'huawei',
    code: '281'
  },
  {
    name: 'JOHNS0',
    code: '282'
  },
  {
    name: 'KT02 D001',
    code: '283'
  },
  {
    name: 'KT02_D002',
    code: '284'
  },
  {
    name: 'KTY001',
    code: '285'
  },
  {
    name: 'KTY003',
    code: '287'
  },
  {
    name: 'KTY004',
    code: '288'
  },
  {
    name: 'KTY005',
    code: '289'
  },
  {
    name: 'SOG0',
    code: '291'
  },
  {
    name: '爱德龙',
    code: '293-295'
  },
  {
    name: '爱特',
    code: '296-299'
  },
  {
    name: '奥力',
    code: '300'
  },
  {
    name: '澳科',
    code: '301-302'
  },
  {
    name: '白雪',
    code: '299'
  },
  {
    name: '高士达',
    code: '303'
  },
  {
    name: '北京京电',
    code: '304'
  },
  {
    name: '波尔卡',
    code: '305-306'
  },
  {
    name: '波乐',
    code: '307'
  },
  {
    name: '波士高',
    code: '308-309'
  },
  {
    name: '博士',
    code: '310'
  },
  {
    name: '彩星',
    code: '311'
  },
  {
    name: '长岭',
    code: '312-323'
  },
  {
    name: '诚远/维修版',
    code: '324'
  },
  {
    name: '创华',
    code: '325-328'
  },
  {
    name: '大金星',
    code: '329-330'
  },
  {
    name: '大拇指',
    code: '331'
  }, {
    name: '冬夏',
    code: '334-335'
  },
  {
    name: '盾安',
    code: '336'
  },
  {
    name: '高路华',
    code: '337-343'
  },
  {
    name: '格尔',
    code: '342-343'
  },
  {
    name: '古桥',
    code: '344'
  },
  {
    name: '光大',
    code: '345-346'
  },
  {
    name: '华高',
    code: '348'
  },
  {
    name: '黄河',
    code: '353'
  },
  {
    name: '汇丰',
    code: '354-356'
  },
  {
    name: '东洋汇丰',
    code: '357,360'
  },
  {
    name: '佳乐',
    code: '358'
  },
  {
    name: '杰士达',
    code: '360'
  },
  {
    name: '金松',
    code: '363-365'
  },
  {
    name: '康佳',
    code: '366-367'
  },
  {
    name: 'UNI AIR',
    code: '368-369'
  },
  {
    name: '康丽',
    code: '368-370'
  }, {
    name: '蓝波',
    code: '371-383'
  },
  {
    name: '乐华',
    code: '383-385'
  },
  {
    name: '利凯尔',
    code: '386-387'
  },
  {
    name: '宁波惠康',
    code: '391-392'
  },
  {
    name: '七星',
    code: '393'
  },
  {
    name: '日彩',
    code: '394'
  },
  {
    name: '日江',
    code: '395-397'
  },
  {
    name: '日索',
    code: '398-399'
  }, {
    name: '沙美',
    code: '400'
  },
  {
    name: '山星',
    code: '401-402'
  },
  {
    name: '上菱',
    code: '403-409'
  },
  {
    name: '绅宝',
    code: '410-411'
  },
  {
    name: '胜风',
    code: '412'
  },
  {
    name: '胜风飞鹿',
    code: '413'
  },
  {
    name: '帅康',
    code: '414'
  },
  {
    name: '双菱',
    code: '415'
  },
  {
    name: '双鹿',
    code: '416-418'
  },
  {
    name: '松星',
    code: '419'
  },
  {
    name: '索伊',
    code: '421-422'
  },
  {
    name: '天元',
    code: '425-428'
  },
  {
    name: '万宝',
    code: '431-433'
  },
  {
    name: '威特力',
    code: '444'
  },
  {
    name: '雾峰',
    code: '445-446'
  },
  {
    name: '西格玛',
    code: '447'
  },
  {
    name: '威力',
    code: '434-443, 553-576'
  },
  {
    name: '西冷',
    code: '448-449'
  },
  {
    name: '先科',
    code: '450-452'
  },
  {
    name: '小天鹅',
    code: '453'
  },
  {
    name: '小鸭',
    code: '454-456'
  }, {
    name: '新乐',
    code: '457-460'
  },
  {
    name: '新凌',
    code: '461'
  },
  {
    name: '星和',
    code: '462-463'
  },
  {
    name: '熊猫',
    code: '464-466'
  },
  {
    name: '扬子',
    code: '467-471,044'
  },
  {
    name: '伊莱克斯',
    code: '471-474'
  },
  {
    name: '迎燕',
    code: '475-483'
  },
  {
    name: '玉兔',
    code: '484-490'
  },
  {
    name: '中意',
    code: '493-494'
  },
  {
    name: '佐丹',
    code: '495'
  },
  {
    name: 'NISO',
    code: '497'
  },
  {
    name: '三洋、NEC',
    code: '500-550, 860'
  },
  {
    name: '三菱',
    code: '551-599'
  },
  {
    name: 'LG',
    code: '600-609'
  },
  {
    name: '三星',
    code: '610-629'
  },
  {
    name: '东芝',
    code: '630-639'
  },
  {
    name: '日立',
    code: '640-659'
  },
  {
    name: '乐声(松下）',
    code: '660-689'
  },
  {
    name: '富士通（珍宝）',
    code: '700-719'
  }, {
    name: '声宝(夏普)',
    code: '720-739'
  }, {
    name: '大金',
    code: '740-759'
  }, {
    name: '惠而浦',
    code: '770-774'
  }, {
    name: 'YORK',
    code: '775-779'
  }, {
    name: '凉宇',
    code: '780'
  }, {
    name: '现代 (大宇)',
    code: '780-789'
  }, {
    name: 'AKIRA',
    code: '796-797'
  }, {
    name: 'KLIMATAIR',
    code: '797-800'
  }, {
    name: 'LOREN-SEBO',
    code: '801-803'
  }, {
    name: 'NIKKO',
    code: '810-811'
  }, {
    name: 'SUNBURG',
    code: '817-820'
  }, {
    name: '稻田',
    code: '821-824'
  }, {
    name: 'TOY0(东洋)',
    code: '825-828'
  }, {
    name: '飞歌',
    code: '829-830'
  }, {
    name: '长府',
    code: '835-838'
  }, {
    name: '歌林',
    code: '850-859'
  }, {
    name: 'ALPIN',
    code: '989-991,998'
  }, {
    name: 'AMCOR',
    code: '501,508,509,532,973,978,979'
  }, {
    name: 'AMICO',
    code: '982'
  }, {
    name: 'BOERKA',
    code: '630'
  }, {
    name: 'CONSUL',
    code: '993'
  }, {
    name: 'ELC0',
    code: '982'
  }, {
    name: 'ELECTER',
    code: '981-986'
  },
  {
    name: 'FEDDERS',
    code: '878'
  },
  {
    name: 'NORCA',
    code: '994'
  },
  {
    name: 'SPEED',
    code: '987'
  },
  {
    name: 'TADIAIR',
    code: '501,508,509,532'
  },
  {
    name: 'TADIRAN',
    code: '501,508,509,532,630,969,978,979,991'
  },
  {
    name: '杂牌组装机',
    code: '044,090,092,095'
  },
  {
    name: '其他品牌',
    code: '496,498,821-828,839-849,865-877,905-976,999'
  }

];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: null,
    brands: brands,
    i:0,code:0,timer01:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  onPullDownRefresh(){

  },

  setAll(){
var that =this
this.data.timer01 = setInterval(
  function(){
 
    that.setData({
     code:parseInt(that.data.code)+1,
   })
   that.sendCode01()

  },2000
)
  },
  // 匹配遥控器
  sendCode() {


   this.clearTimer()
 
   
    let code = this.data.code
    let codeHex=this.toHex(parseInt(code))
    let url = '02 0 ' + codeHex.slice(0,2) + ' ' + codeHex.slice(2,4) + ' 00'
    let roleAirCondition = [url]
    let msg = this.getCommandsWithXor(roleAirCondition)
    let msg01 = baseUrl.stateDevice[0]
    let topic = app.globalData.topic
    this.pahoSend(msg[0], topic);
    setTimeout(() => {
      this.pahoSend(msg01, topic)
    }, 1000)
  },
  sendCode01() {

 
    let code = this.data.code
    let codeHex=this.toHex(parseInt(code))
    let url = '02 0 ' + codeHex.slice(0,2) + ' ' + codeHex.slice(2,4) + ' 00'
    let roleAirCondition = [url]
    let msg = this.getCommandsWithXor(roleAirCondition)
    let msg01 = baseUrl.stateDevice[0]
    let topic = app.globalData.topic
    this.pahoSend(msg[0], topic);
    setTimeout(() => {
      this.pahoSend(msg01, topic)
    }, 1000)
  },
  pahoSend(modbus, topic) {
    var message = new paho.Message(modbus)
    message.destinationName = topic
    message.qos = 0
    message.retained = false
    app.globalData.client.send(message)
  },
   toHex(num) {
    const hex = num.toString(16).toUpperCase().padStart(4, '0');
    return hex;
  },

  getCommandsWithXor(commands) {
    const commandArrays = commands.map(command => {
      // 将16进制字符串转换为数字数组
      const dataArray = command.split(' ').map(numStr => parseInt(numStr, 16));

      // 计算异或和
      const xorSum = dataArray.slice(0, 5).reduce((acc, cur) => {
        return acc ^ cur;
      }, 0);

      // 将异或和添加到原数字数组中
      const dataArrayWithXor = [...dataArray.slice(0, 5), xorSum];

      // 将数字数组转换为Uint8Array
      return new Uint8Array(dataArrayWithXor);
    });

    return commandArrays;
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
    this.clearTimer()

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.clearTimer()
  },
clearTimer(){
  let end = setInterval(function () { }, 10000);
  for (let i = 1; i <= end; i++) {clearInterval(i);
  }
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