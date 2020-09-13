// miniprogram/pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  send(){
    var dataa = {
      apikey:'9b11127a9701975c734b8aee81ee3526',
      mobile:'13906537862',
      text:'【QSCamera】您的注册验证码是1234,有效期为5min，请尽快验证'
    }
    wx.request({
      url: 'https://sms.yunpian.com/v2/sms/single_send.json',
      method:'POST',
      data:dataa,
      header:{
        "Content-Type":"application/json;charset=utf8"
      }
    })
  }
})