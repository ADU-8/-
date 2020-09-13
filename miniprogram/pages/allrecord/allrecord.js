// miniprogram/pages/allrecord/allrecord.js
const { RecordModel } = require("../../models/recordmodel")
const recordModel = new RecordModel()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AllRecord_NotBack:[],
    IsLogin:false,
    IsLoading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      IsLogin:app.globalData.IsLogin
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    const AllRecord_NotBack = await recordModel.GetAllRecord_NotBack()
    const that = this
    this.setData({
      AllRecord_NotBack,
      IsLoading:false
    })
    wx.hideNavigationBarLoading() //完成停止加载
    console.log(AllRecord_NotBack)

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
    const AllRecord_NotBack = await recordModel.GetAllRecord_NotBack()
    this.setData({
      AllRecord_NotBack,
      IsLogin:app.globalData.IsLogin
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
  onPullDownRefresh:async function () {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    const AllRecord_NotBack = await recordModel.GetAllRecord_NotBack()
    this.setData({
      AllRecord_NotBack,
      IsLogin:app.globalData.IsLogin
    })
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);


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

  }
})