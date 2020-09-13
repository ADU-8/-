const {
  CodeModel
} = require("../../models/codemodel");
const {
  RecordModel
} = require("../../models/recordmodel");
var util = require('../../util/util.js');
const {
  EquipModel
} = require("../../models/equipmodel");
// miniprogram/pages/login/collegestudents/collegestudents.js
var app = getApp()
const codeModel = new CodeModel()
const recordModel = new RecordModel()
const equipModel = new EquipModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: 0,
    tab: 0,
    num: 0,
    usertype: "视频团队",
    allrecord: [],
    weekrecord: [],
    monthrecord: [],
    CheckItem: 1,
    EquipCheck: 1,
    monthrecordnum: 0,
    weekrecordnum: 0,
    allrecordnum: 0,
    IsLoad: false,
    IsLoadweekAll: false,
    IsLoadmonthAll: false,
    IsLoadallAll: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let usertype = wx.getStorageSync('userInfo').usertype
    let allrecord = recordModel.GetRecord_Some(0, 10, "all")
    let weekrecord = recordModel.GetRecord_Some(0, 10, "week")
    let monthrecord = recordModel.GetRecord_Some(0, 10, "month")
    Promise.all([allrecord, weekrecord, monthrecord]).then(async res => {
      var that = this
      that.setData({
        usertype,
        weekrecord: await weekrecord,
        monthrecord: await monthrecord,
        allrecord: await allrecord
      })
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
  changeItem: function (e) {
    this.setData({
      item: e.target.dataset.item
    })
  },
  changeTab: function (e) {
    this.setData({
      tab: e.detail.current
    })
  },
  call: function (e) {
    console.log("id", e.target.dataset.id)
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.id
    })
  },
  radiochange: function (res) {
    const value = res.detail.value
    if (value == 'weekrecord') {
      this.setData({
        CheckItem: 1
      })
    } else if (value == 'monthrecord') {
      this.setData({
        CheckItem: 2
      })
    } else if (value == 'allrecord') {
      this.setData({
        CheckItem: 3
      })
    }
  },
  async LoadMore(CheckItem) {
    if (this.data.IsLoad == false) {
      this.setData({
        IsLoad: true
      })
      console.log(this.data.IsLoad)
      console.log(CheckItem)
      if (CheckItem == 1 && this.data.IsLoadweekAll == false) {
        let weekrecordnum = this.data.weekrecordnum + 10
        let newweekrecord = await recordModel.GetRecord_Some(weekrecordnum, 10, "week")
        if (newweekrecord.length != 0) {
          let weekrecord = this.data.weekrecord
          let res = weekrecord.concat(newweekrecord)
          this.setData({
            weekrecordnum: weekrecordnum,
            weekrecord: res
          })
        } else {
          this.setData({
            IsLoadweekAll: true
          })
        }
      } else if (CheckItem == 2 && this.data.IsLoadmonthAll == false) {
        let monthrecordnum = this.data.monthrecordnum + 10
        let newmonthrecord = await recordModel.GetRecord_Some(monthrecordnum, 10, "month")
        if (newmonthrecord.length != 0) {
          let monthrecord = this.data.monthrecord
          let res = monthrecord.concat(newmonthrecord)
          this.setData({
            monthrecordnum: monthrecordnum,
            monthrecord: res
          })
        } else {
          this.setData({
            IsLoadmonthAll: true
          })
        }

      } else if (CheckItem == 3 && this.data.IsLoadallAll == false) {
        let allrecordnum = this.data.allrecordnum + 10
        let newallrecord = await recordModel.GetRecord_Some(allrecordnum, 10, "all")
        if (newallrecord.length != 0) {
          let allrecord = this.data.allrecord
          let res = allrecord.concat(newallrecord)
          this.setData({
            allrecordnum: allrecordnum,
            allrecord: res
          })
        } else {
          this.setData({
            IsLoadallAll: true
          })
        }
      }
      console.log(CheckItem)
      this.setData({
        IsLoad: false
      })
    }
  },
  scrollToLower: function (e) {
    console.log(this.data.CheckItem)
    console.log(this.data.IsLoad)
    this.LoadMore(this.data.CheckItem)
  },
  ReturnEquip(){
    let allrecord = recordModel.GetRecord_Some(0, this.data.allrecordnum, "all")
    let weekrecord = recordModel.GetRecord_Some(0, this.data.weekrecordnum, "week")
    let monthrecord = recordModel.GetRecord_Some(0, this.data.monthrecordnum, "month")
    Promise.all([allrecord, weekrecord, monthrecord]).then(async res => {
      var that = this
      that.setData({
        weekrecord: await weekrecord,
        monthrecord: await monthrecord,
        allrecord: await allrecord
      })
    })
  }
})