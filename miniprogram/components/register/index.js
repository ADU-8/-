// components/register/index.js
const md5 = require('../../util/md5.js')
import {
  UserModel
} from '../../models/usermodel.js'
import {
  MessageModel
} from '../../models/messagemodel.js'
import { CodeModel } from '../../models/codemodel.js'

const userModel = new UserModel()
const messageModel = new MessageModel()
const codeModel = new CodeModel();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: ""
    },
    phone: {
      type: String,
      value: ""
    },
    code: {
      type: String,
      value: ""
    },
    usertype: {
      type: String,
      value: "视频团队"
    },
    EnterTime:{
      type:String,
      value:""
    },
    Today:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index: 0,
    picker: ['视频团队', '摄影部'],
    IsInviteCodeCorrect: 0,
    IsPasswordShow: 0,
    IsPhoneCodeCorrect: 0,
    IsPhoneCodeSend:0,
    Time:120   //用于倒计时
  },

  /**
   * 组件的方法列表
   */
  methods: {
    formSubmit: async function (e) {
      const userOpenid = wx.getStorageSync('userOpenid')
      wx.showLoading({
        title: '注册中',
      })
      if (this.data.IsInviteCodeCorrect && this.data.IsPhoneCodeCorrect) {
        let RegisterRes = await userModel.RegisterUserInfo(userOpenid, e.detail.value.name, e.detail.value.phone, this.data.picker[this.data.index],this.data.EnterTime)
        let userInfo = null
        if (RegisterRes) {
          console.log(RegisterRes)
          userInfo = {
            'name': e.detail.value.name,
            'phone': e.detail.value.phone,
            'usertype': this.data.picker[this.data.index],
            '_openid': userOpenid,
            '_id': RegisterRes._id,
            'year':this.data.EnterTime
          }
        }
        wx.setStorageSync('userInfo', userInfo)
        this.triggerEvent('Register', {
          userInfo: userInfo,
          RegisterRes: RegisterRes
        }, {})
      } else if (this.data.IsPhoneCodeCorrect == false) {
        wx.showToast({
          icon: 'none',
          title: '手机验证码错误，请重试',
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '内部邀请码错误，请重试',
        })
      }

    },
    PickerChange(e) {
      this.setData({
        index: e.detail.value
      })
    },
    CheckInvitationCode(e) {
      const InputCode = md5.hex_md5(e.detail.value)
      const VideoCode = wx.getStorageSync('VideoInvitationCode')
      const PhotographyCode = wx.getStorageSync('PhotographyInvitationCode')
      if (this.data.index == 0) {
        if (InputCode == VideoCode) {
          this.setData({
            IsInviteCodeCorrect: 1
          })
        } else {
          this.setData({
            IsInviteCodeCorrect: 0
          })
        }
      } else {
        if (InputCode == PhotographyCode) {
          this.setData({
            IsInviteCodeCorrect: 1
          })
        } else {
          this.setData({
            IsInviteCodeCorrect: 0
          })
        }
      }
    },
    ChangePasswordStatus() {
      this.setData({
        IsPasswordShow: !this.data.IsPasswordShow
      })
    },
    ChangeTime(){
      const that = this
      let Time = this.data.Time
      if(Time>0){
        Time--;
        this.setData({
          Time:Time
        })
      }else{
        this.setData({
          IsPhoneCodeSend:0
        })
      }
      setTimeout(function(){
        that.ChangeTime()
      },1000)
    },
    async SendMsg() {
      let num = this.data.phone
      console.log(num)
      if (this.validatemobile(num) && this.data.IsInviteCodeCorrect == 1) {
        this.ChangeTime()
        this.setData({
          IsPhoneCodeSend: 1
        })
        let code = this.GenerateCode(6)
        const res = await messageModel.SendMsg(num, code)
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
      } else if (this.data.IsInviteCodeCorrect == 0) {
        wx.showToast({
          icon: 'none',
          title: '请先输入部门邀请码',
        })
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
    },
    BindNameInput(e) {
      this.setData({
        name: e.detail.value
      })
    },
    async SendErrorReport(){
      var name = this.data.name
      var phone = this.data.phone
      var usertype = this.data.usertype
      wx.showModal({
        title: '发送错误报告',
        content: '是否无法注册需发送错误报告？(注意：请先填写您的用户名、手机、部门后，再提交错误报告！)',
        showCancel: true,//是否显示取消按钮
        success: async function (res) {
          var that = this
           if (res.cancel) {
              //点击取消,默认隐藏弹框
           } else {
              //点击确定
              const _openid = wx.getStorageSync('userOpenid');
              await codeModel.SendError(name,phone,usertype,_openid)
              wx.showToast({
                title: '发送成功！',
              })
           }
        },
        fail: function (res) { },//接口调用失败的回调函数
        complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
     })
    },
    BindEnterTimeChange(e){
      this.setData({
        EnterTime:e.detail.value
      })
    }

  }

})