// miniprogram/pages/equip/equip.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AllEquip_Video: [],
    AllEquip_Photo: [],
    SwitchType: true, //true为显示视频团队，false为显示摄影部
    IsSearch: false,
    historyWords: [],
    SearchRes: [],
    IsLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const AllEquip_Video = wx.getStorageSync('Equip_Video')
    const AllEquip_Photo = wx.getStorageSync('Equip_Photo')
    const historyWords = wx.getStorageSync('historyWords')
    this.setData({
      AllEquip_Video,
      AllEquip_Photo,
      historyWords
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      IsLogin: app.globalData.IsLogin
    })
    const AllEquip_Video = wx.getStorageSync('Equip_Video')
    const AllEquip_Photo = wx.getStorageSync('Equip_Photo')
    const historyWords = wx.getStorageSync('historyWords')
    this.setData({
      AllEquip_Video,
      AllEquip_Photo,
      historyWords
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    const AllEquip_Video = wx.getStorageSync('Equip_Video')
    const AllEquip_Photo = wx.getStorageSync('Equip_Photo')
    const historyWords = wx.getStorageSync('historyWords')
    this.setData({
      AllEquip_Video,
      AllEquip_Photo,
      historyWords,
      IsLogin: app.globalData.IsLogin
    })
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changeSwitch(e) {
    console.log(e)
    this.setData({
      SwitchType: e.detail.value
    })
  },
  BindfocusSearchEquip() {
    this.setData({
      IsSearch: true
    })
  },
  HideSearchEquip() {
    this.setData({
      IsSearch: false,
      SearchRes: []
    })
  },
  onConfirm(event) { //点击历史搜索进行搜索
    console.log(event.detail.text)
    this.Search(event.detail.text)
  },
  searchEquip(e) { //按下软键盘确认进行搜索
    //存储搜索历史
    let historyWords = this.data.historyWords;
    if (historyWords.length == 10) {
      historyWords.splice(0, 1)
      historyWords.push(e.detail.value)
    } else {
      console.log(historyWords)
      historyWords.push(e.detail.value)
    }
    wx.setStorageSync('historyWords', historyWords)

    this.setData({
      historyWords
    })
    this.Search(e.detail.value)
  },
  Search(text) { //搜索主函数
    let SearchRes = []
    var that = this
    this.data.AllEquip_Video.forEach(function (item, index) {
      if (that.countSubstr(item.equipmentname, text) != 0) {
        SearchRes.push(item)
      }
    })
    this.data.AllEquip_Photo.forEach(function (item, index) {
      if (that.countSubstr(item.equipmentname, text) != 0) {
        SearchRes.push(item)
      }
    })
    this.setData({
      SearchRes
    })

  },
  countSubstr(str, substr) {
    var reg = new RegExp(substr, "g");
    return str.match(reg) ? str.match(reg).length : 0; //若match返回不为null，则结果为true，输出match返回的数组(["test","test"])的长度
  }
})