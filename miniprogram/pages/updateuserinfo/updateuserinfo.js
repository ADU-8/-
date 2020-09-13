// miniprogram/pages/updateuserinfo/updateuserinfo.js
import {
  UserModel
} from '../../models/usermodel.js'
const userModel = new UserModel()
import {
  MessageModel
} from '../../models/messagemodel.js'

const messageModel = new MessageModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null,
    phone: null,
    Time: 120,
    IsPhoneCodeSend: false,
    IsPhoneCodeCorrect: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      name: userInfo.name,
      phone: userInfo.phone
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
  formSubmit: async function (e) {
    const _id = wx.getStorageSync('userInfo')._id
    if (this.data.IsPhoneCodeCorrect == true) {
      wx.showLoading({
        title: '修改中',
      })
      let RegisterRes = await userModel.UpdateUserInfo(_id, e.detail.value.name, e.detail.value.phone)
      let userInfo = wx.getStorageSync('userInfo')
      if (RegisterRes) {
        console.log(RegisterRes)
        userInfo['name'] = e.detail.value.name
        userInfo['phone'] = e.detail.value.phone
      }
      wx.setStorageSync('userInfo', userInfo)
      wx.hideLoading()
      wx.switchTab({
        url: '../index/index',
      })
    }else{
      wx.showToast({
        icon:'none',
        title: '手机验证码错误',
      })
    }
  },
  ChangeTime() {
    const that = this
    let Time = this.data.Time
    if (Time > 0) {
      Time--;
      this.setData({
        Time: Time
      })
    } else {
      this.setData({
        IsPhoneCodeSend: false
      })
    }
    setTimeout(function () {
      that.ChangeTime()
    }, 1000)
  },
  async SendMsg() {
    let num = this.data.phone
    console.log(num)
    if (this.validatemobile(num)) {
      this.ChangeTime()
      this.setData({
        IsPhoneCodeSend: 1
      })
      let code = this.GenerateCode(6)
      const res = await messageModel.SendMsg_Modify(num, code)
      if (res.result.Fee != 0) {
        wx.showToast({
          title: '验证码已发送',
        })
      } else if (res.result.Code = "InvalidParameterValue.IncorrectPhoneNumber") {
        wx.showToast({
          icon: 'none',
          title: '手机号码有误,请2min后重试',
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '服务器出错,请2min后重试',
        })
      }
    }
  },
  validatemobile(mobile) {
    if (mobile.length == 0) {
      console.log('手机号码不能为空！');
      wx.showToast({
        icon: "none",
        title: '手机号码不能为空！',
      })
      return false;
    }

    if (mobile.length != 11) {
      wx.showToast({
        icon: "none",
        title: '请输入有效的手机号码，需是11位！',
      })
      return false;
    }
    return true
  },
  GenerateCode(len) {
    len = len || 32;
    var $chars = '0123456789'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var code = '';
    for (var i = 0; i < len; i++) {
      code += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    wx.setStorageSync('PhoneCode', code)
    setTimeout(function () {
      wx.setStorageSync('PhoneCode', "AAAAAA") //代表PhoneCode已经过期
    }, 300000)
    return code;
  },
  CheckPhoneCode(e) {
    const InputCode = e.detail.value
    const PhoneCode = wx.getStorageSync('PhoneCode')
    if (PhoneCode == "AAAAAA") {
      return false
    }
    if (InputCode == PhoneCode) {
      console.log(1)
      this.setData({
        IsPhoneCodeCorrect: 1
      })
    } else {
      this.setData({
        IsPhoneCodeCorrect: 0
      })
    }
  },
  BindPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  }
})