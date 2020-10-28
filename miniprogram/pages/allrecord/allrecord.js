// miniprogram/pages/allrecord/allrecord.js
const { RecordModel } = require("../../models/recordmodel")
const { MessageModel} = require("../../models/messagemodel")
const recordModel = new RecordModel()
const messageModel = new MessageModel()
var util = require('../../util/util.js')
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
    this.CheckNeedTipRecord()
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

  },
  calculatetime(returndate,returntime,nowdate,nowtime){
    console.log(returndate,returntime,nowdate,nowtime)
    var time1 = this.calculatesjc(returndate,returntime)
    var time2 = this.calculatesjc(nowdate,nowtime)
    return time2-time1
  },
  calculatesjc(date,time){
    var year = (parseInt(date.substr(0,4))) *  365 * 24
    var month = (parseInt(date.substr(5,2))) * 30 * 24
    var day = (parseInt(date.substr(8,2))) * 24
    var hour = (parseInt(time.substr(0,2))) 
    var min =  (parseInt(time.substr(3,2))) / 60 
   return (year+month+day+hour+min)
  },
  CheckNeedTipRecord(){
    var time = util.formatTime(new Date());
    var nowdate = time[0]
    var nowtime = time[2]
    var that = this
    this.data.AllRecord_NotBack.forEach(function(item,index){
      const lasttiptime = item.LastTipTime 
      const lasttipdate = item.LastTipDate 
      const returndate = item.EndDate 
      const returntime = item.EndTime
      var during1 = that.calculatetime(returndate,returntime,nowdate,nowtime)
      var during2 = that.calculatetime(lasttipdate,lasttiptime,nowdate,nowtime)
      console.log(during1)
      console.log(during2)
      if(during1>4 && during2>4){
        var Equip = ""
        if(item.VideoChoosed_list.length!=0){
          Equip = "‘" + item.VideoChoosed_list[0].equipmentname.substr(0,8) + "…’"
        }else{
          Equip = "‘" + item.PhotographyChoosed_list[0].equipmentname.substr(0,8) + "…’"
        }
        console.log(item.BorrowManInfo.phone,item.BorrowManInfo.usertype+"_"+item.BorrowManInfo.name,Equip,returndate.substr(5,5)+" "+returntime,nowdate.substr(5,5)+" "+nowtime)
        messageModel.SendTipMsg(item.BorrowManInfo.phone,item.BorrowManInfo.usertype+"_"+item.BorrowManInfo.name,Equip,returndate.substr(5,5)+" "+returntime,nowdate.substr(5,5)+" "+nowtime)
        recordModel.updateLastTipTime(item._id,nowdate,nowtime)
      }
    })
  }
})