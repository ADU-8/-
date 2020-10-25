// miniprogram/pages/accuratesearch/accuratesearch.js
const {
  RecordModel
} = require("../../models/recordmodel");
const recordModel = new RecordModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:[],
    recordnum:0,
    IsLoad:false,
    IsLoadAll:false,
    date:"",
    date2:"",
    IsLoading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    let  scrollHeight = wx.getSystemInfoSync().windowHeight;
    var startdate = options.date
    var enddate = options.date2
    this.setData({
      date:startdate,
      date2:enddate,
    })
    var res = await recordModel.GetRecord_Accurate(0, 10,startdate,enddate)
    console.log(res)
    this.setData({
      IsLoading:false,
      record:res,
      scrollHeight: scrollHeight
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
  async ReturnEquip(){
    let record = await recordModel.GetRecord_Some(0, this.data.recordnum, "all")
    this.setData({
      record: record
    })
  },
  async LoadMore() {
    if (this.data.IsLoad == false) {
      this.setData({
        IsLoad: true
      })
      console.log("this.data.IsLoad",this.data.IsLoad)
      if (this.data.IsLoadAll == false) {
        let recordnum = this.data.recordnum + 10
        console.log("recordnum",recordnum)
        console.log( this.data.date, this.data.date2)
        let newrecord = await recordModel.GetRecord_Accurate(recordnum, 10, this.data.date,this.data.date2)
        if (newrecord.length != 0) {
          let record = this.data.record
          let res = record.concat(newrecord)
          this.setData({
            recordnum: recordnum,
            record: res
          })
        } else {
          this.setData({
            IsLoadAll: true
          })
        }
      } 
      this.setData({
        IsLoad: false
      })
    }
  },
  scrollToLower: function (e) {
    console.log("this.data.IsLoad",this.data.IsLoad)
    this.LoadMore()
  },
})