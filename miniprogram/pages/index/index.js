//index.js
const app = getApp()
import {
  UserModel
} from '../../models/usermodel.js'
import {
  CodeModel
} from '../../models/codemodel.js'
import {
  EquipModel
} from '../../models/equipmodel.js'
const codeModel = new CodeModel()
const userModel = new UserModel()
const equipModel = new EquipModel()
Page({
  data: {
    Version:"1.3.0",
    IsReady: 0,
    userInfo: {},
    IsLogin: 0,
    IsVerifying: 0,
    IsFirst: 0,
    VersionModal: false,
    IsUpdateFirst:0
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
  onRegister(event) {
    if (event.detail.RegisterRes) {
      wx.hideLoading()
      this.setData({
        userInfo: event.detail.userInfo,
        IsLogin: 1
      })
      app.globalData.IsLogin = true
    } else {
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: '发生了一个意料之外的错误，请重试',
      })
    }
    console.log(event)
  },
  onLoad: async function () {
    this.CheckIsFirst()
    const userOpenid = await userModel.GetOpenid()
    const userInfo = userModel.GetUserInfo(userOpenid)
    const VideoInvitationCode = null
    const PhotographyInvitationCode = null
    if (!userInfo) {
      VideoInvitationCode = codeModel.GetCode("VideoInvitationCode")
      PhotographyInvitationCode = codeModel.GetCode("PhotographyInvitationCode")
    }
    const VideoAdminPassword = codeModel.GetCode("VideoAdminPassword")
    const PhotographyAdminPassword = codeModel.GetCode("PhotographyAdminPassword")

    const Equip_Video = equipModel.GetEquip("Video");
    const Equip_Photo = equipModel.GetEquip("Photo");

    Promise.all([userInfo,VideoInvitationCode, PhotographyInvitationCode, VideoAdminPassword, PhotographyAdminPassword, Equip_Video, Equip_Photo]).then(async res => {
      if (!userInfo) {
        wx.setStorageSync('VideoInvitationCode', await VideoInvitationCode)
        wx.setStorageSync('PhotographyInvitationCode', await PhotographyInvitationCode)
      }
      wx.setStorageSync('userInfo', await userInfo)
      wx.setStorageSync('VideoAdminPassword', await VideoAdminPassword)
      wx.setStorageSync('PhotographyAdminPassword', await PhotographyAdminPassword)
      wx.setStorageSync('Equip_Video', await Equip_Video)
      wx.setStorageSync('Equip_Photo', await Equip_Photo)
      if (await userInfo) {
        this.setData({
          userInfo: await userInfo,
          IsLogin: 1
        })
        app.globalData.IsLogin = true
      }
      this.setData({
        IsReady: 1
      })
    })
  },
  HideModal() {
    this.setData({
      IsFirst: 0
    })
  },
  UpdateUserInfo() {
    wx.navigateTo({
      url: '../updateuserinfo/updateuserinfo',
    })
  },
  onShow() {
    const userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    this.setData({
      userInfo
    })
  },
  GoAdmin() {
    wx.navigateTo({
      url: '../admin/admin'
    })
  },
  VerifySuccess() {
    const userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    this.setData({
      userInfo
    })
  },
  CheckIsFirst() {
    var value = wx.getStorageSync('key')
    if (value) {
      this.CheckIsUpdateFirst()
    } else {
      wx.setStorage({
        key: "key",
        data: {
          "flag": 1
        }
      })
      this.setData({
        IsFirst: 1
      })
    }
  },
  CheckIsUpdateFirst(){
    console.log("1")
    var Version = wx.getStorageSync('version')
    if (Version || Version == this.data.Version) {

    } else {
      wx.setStorageSync('version', this.data.Version)
      this.setData({
        IsUpdateFirst: 1
      })
    }
  },
  ShowModal2() {
    this.setData({
      VersionModal: true,
    })
  },
  HideModal2() {
    this.setData({
      VersionModal: false,
      IsUpdateFirst:0
    })
  },
  GoUpdateLog() {
    this.setData({
      VersionModal: false
    })
    wx.navigateTo({
      url: '../updatelog/updatelog',
    })
  }


})