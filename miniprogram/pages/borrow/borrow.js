const {
  EquipModel
} = require("../../models/equipmodel")
const equipModel = new EquipModel()
const {
  RecordModel
} = require("../../models/recordmodel")
const recordModel = new RecordModel()
var util = require('../../util/util.js')
var app = getApp()
// miniprogram/pages/borrow/borrow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StartDate: null,
    StartTime: null,
    EndDate: null,
    EndTime: null,
    Today: null,
    DateBorder: null,
    Video_list: [],
    VideoChoosed_list: [],
    Photography_list: [],
    PhotographyChoosed_list: [],
    Purpose: "",
    loadModal: false,
    Msg1: "校验器材中",
    Msg2: "",
    Msg3: "",
    Msg4: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.multiple_photo = this.selectComponent("#multiple_photo");
    this.multiple_video = this.selectComponent("#multiple_video");
    var time = util.formatTime(new Date());
    const Video_list = wx.getStorageSync('Equip_Video')
    const Photography_list = wx.getStorageSync('Equip_Photo')
    this.setData({
      StartDate: time[0],
      EndDate: time[0],
      Today: time[0],
      DateBorder: time[1],
      StartTime: time[2],
      EndTime: time[2],
      Video_list: Video_list,
      Photography_list: Photography_list
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: async function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    const Equip_Video = await equipModel.GetEquip("Video");
    const Equip_Photo = await equipModel.GetEquip("Photo");
    this.setData({
      Video_list: Equip_Video,
      Photography_list: Equip_Photo
    })
    this.multiple_photo.updatedata()
    this.multiple_video.updatedata()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: async function () {
    const Equip_Video = await equipModel.GetEquip("Video");
    const Equip_Photo = await equipModel.GetEquip("Photo");
    this.setData({
      Video_list: Equip_Video,
      Photography_list: Equip_Photo
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: async function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    const Equip_Video = wx.getStorageSync('Equip_Video');
    const Equip_Photo = wx.getStorageSync('Equip_Photo');
    this.setData({
      Video_list: Equip_Video,
      Photography_list: Equip_Photo
    })
    this.multiple_photo.updatedata()
    this.multiple_video.updatedata()
    setTimeout(function () {
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
  async FormSubmit(e) {
    if (!app.globalData.IsLogin) {
      wx.showToast({
        icon: 'none',
        title: '请先登录',
      })
      return
    }
    let SecCheckRes = await recordModel.checkMsgSec(this.data.Purpose);
    let SecCheck = SecCheckRes.result.code
    if(SecCheck == "500"){
      wx.showToast({
        icon:'none',
        title: '用途简介中有非法内容!',
      })
    }
    console.log(SecCheckRes)
    let FormCheck = this.checkEquip() && this.checkTime() && this.checkPurpose() && this.checkEquipCanbeBorrowOut()
    if (FormCheck) {
      //向云端请求时再一次确认这些器材未被借用
      let EquipCheck = true;
      let VideoChoosed_listLength = this.data.VideoChoosed_list.length
      this.setData({
        loadModal: true
      })
	  var temp = []
      //视频团队器材校验
	  for (var i = 0; i < VideoChoosed_listLength; i++) {
        temp.push(equipModel.CheckEquip(this.data.VideoChoosed_list[i]._id))
      }
	  //摄影部器材校验
      let PhotographyChoosed_listLength = this.data.PhotographyChoosed_list.length
      if (PhotographyChoosed_listLength != 0) {
        for (var i = 0; i < PhotographyChoosed_listLength; i++) {
          temp.push(equipModel.CheckEquip(this.data.PhotographyChoosed_list[i]._id))
        }
      }
	  //等待校验完成进行下一步借用：
      Promise.all(temp).then(async res => {
        for (var i = 0; i < VideoChoosed_listLength + PhotographyChoosed_listLength; i++) {
          EquipCheck = EquipCheck && res[i]
        }
        const BorrowManInfo = wx.getStorageSync('userInfo')
        const that = this
        //借用器材
        if (EquipCheck) {
		  //借用视频团队器材
          for (var i = 0; i < VideoChoosed_listLength; i++) {
            equipModel.BorrowEquip(this.data.VideoChoosed_list[i]._id, that.data.EndDate, that.data.EndTime, BorrowManInfo)
          }
		  //借用摄影部器材
          for (var i = 0; i < PhotographyChoosed_listLength; i++) {
            equipModel.BorrowEquip(this.data.PhotographyChoosed_list[i]._id, that.data.EndDate, that.data.EndTime, BorrowManInfo)
          }
          this.setData({
            Msg1: "创建租借记录中",
          })
		  //创建租借记录
          await recordModel.CreateBorrowRecord(this.data.VideoChoosed_list, this.data.PhotographyChoosed_list, this.data.StartDate, this.data.StartTime, this.data.EndDate, this.data.EndTime, this.data.Purpose, BorrowManInfo)
          this.setData({
            loadModal: false
          })
          wx.showToast({
            title: '租借成功',
          })
          this.ClearPageInfo()
          wx.switchTab({
            url: '../myrecord/myrecord',
          })
        } else {
          this.setData({
            loadModal: false
          })
          wx.showToast({
            icon: 'none',
            title: '有器材已被别人抢先一步借走啦，请下拉刷新后重新进入该页面再进行选择',
            duration: 3000
          })
          that.ClearPageInfo()
        }
      })
    }
  },
  ClearPageInfo() {
    this.setData({
      VideoChoosed_list: [],
      PhotographyChoosed_list: [],
      Purpose: ""
    })
  },
  checkEquip: function () {
    if (this.data.VideoChoosed_list.length == 0 && this.data.PhotographyChoosed_list.length == 0) {
      wx.showToast({
        title: "你还未选择器材",
        icon: 'none',
        duration: 1500
      })
      return false
    } else {
      return true
    }
  },
  checkEquipCanbeBorrowOut: function () {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo.usertype == "摄影部") {
      console.log(111)
      for (var i = 0; i < this.data.VideoChoosed_list.length; i++) {
        if (this.data.VideoChoosed_list[i].CanbeBorrowOut == false) {
          wx.showToast({
            title: "器材" + this.data.VideoChoosed_list[i].equipmentname + '为该部门不可外借器材，请取消选择',
            icon: 'none',
            duration: 1500
          })
          return false
        }
      }
    } else {
      for (var i = 0; i < this.data.PhotographyChoosed_list.length; i++) {
        if (this.data.PhotographyChoosed_list[i].CanbeBorrowOut == false) {
          wx.showToast({
            title: "器材" + this.data.PhotographyChoosed_list[i].equipmentname + '为该部门不可外借器材，请取消选择',
            icon: 'none',
            duration: 1500
          })
          return false
        }
      }
    }
    return true
  },
  checkPurpose: function (e) {
    console.log(e)
    if (this.data.Purpose == "") {
      wx.showToast({
        title: "你还未填写用途",
        icon: 'none',
        duration: 1500
      })
      return false
    } else {
      return true
    }
  },
  checkTime: function () {
    if (this.data.StartDate == this.data.EndDate) {
      if (this.data.StartTime < this.data.EndTime) {
        return true
      } else {
        wx.showToast({
          icon: 'none',
          title: '时间有误',
        })
        return false
      }
    } else if (this.data.StartDate < this.data.EndDate) {
      return true;
    } else {
      wx.showToast({
        icon: 'none',
        title: '时间有误',
      })
      return false
    }
  },
  multipleCancel_photo() {
    this.multiple_photo.hideMultiple();
  },
  multipleCancel_video() {
    this.multiple_video.hideMultiple();
  },
  //确认事件
  multipleConfirm_photo(e) {
    console.log('获取选中的项==', e.detail);
    this.setData({
      PhotographyChoosed_list: e.detail,
    })
    this.multiple_photo.hideMultiple();
  },
  multipleConfirm_video(e) {
    console.log('获取选中的项==', e.detail);
    this.setData({
      VideoChoosed_list: e.detail,
    })
    this.multiple_video.hideMultiple();
  },
  showMultiple_photo: function () {
    if (!app.globalData.IsLogin) {
      wx.showToast({
        icon: 'none',
        title: '请先登录',
      })
      return
    }
    this.multiple_photo.showMultiple();
  },
  showMultiple_video: function () {
    if (!app.globalData.IsLogin) {
      wx.showToast({
        icon: 'none',
        title: '请先登录',
      })
      return
    }
    this.multiple_video.showMultiple();
  },
  BindPurposeInput(e) {
    this.setData({
      Purpose: e.detail.value
    })
    console.log(e)
  },
  BindStartDateChange(e) {
    this.setData({
      StartDate: e.detail.value
    })
  },
  BindStartTimeChange(e) {
    this.setData({
      StartTime: e.detail.value
    })
  },
  BindEndDateChange(e) {
    this.setData({
      EndDate: e.detail.value
    })
  },
  BindEndTimeChange(e) {
    this.setData({
      EndTime: e.detail.value
    })
  }
})