const { RecordModel } = require("../../models/recordmodel")
const recordModel = new RecordModel()
// miniprogram/pages/myrecord/myrecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    MyRecord:[],
    IsBlank:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const _openid = wx.getStorageSync('userOpenid')
    const MyRecord = await recordModel.GetMyRecord(_openid)
    const that = this
    this.setData({
      MyRecord:MyRecord
    })
    console.log(MyRecord)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    const _openid = wx.getStorageSync('userOpenid')
    const MyRecord = await recordModel.GetMyRecord(_openid)
    this.setData({
      MyRecord:MyRecord
    })
    console.log(MyRecord)
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
  onPullDownRefresh:async function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    const _openid = wx.getStorageSync('userOpenid')
    const MyRecord = await recordModel.GetMyRecord(_openid)
    this.setData({
      MyRecord:MyRecord
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
  async ReturnEquip(event){
    const _openid = wx.getStorageSync('userOpenid')
    const MyRecord = await recordModel.GetMyRecord(_openid)
    this.setData({
      MyRecord:MyRecord
    })
    
  }
})