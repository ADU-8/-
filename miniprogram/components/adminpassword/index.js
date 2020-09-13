// components/adminpassword/index.js
const {
  CodeModel
} = require("../../models/codemodel");
// miniprogram/pages/login/collegestudents/collegestudents.js
const codeModel = new CodeModel()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    usertype:String,
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    InviteCode:'',
    Password:'',
  },
  /**
   * 组件的方法列表
   */
  methods: {
    inviteSubmit: async function () {
      if (!this.CheckInvite()) {
        wx.showToast({
          icon: 'none',
          title: '输入为空',
        })
        return
      }
      wx.showLoading({
        title: '修改中',
      })
      const that = this;
      let type = ""
      if (this.data.usertype == "视频团队") {
        type = "VideoInvitationCode"
      } else {
        type = "PhotographyInvitationCode"
      }
      await codeModel.ModifyCode(type, this.data.InviteCode)
      wx.hideLoading();
      wx.showToast({
        title: '修改成功',
      })
      this.setData({
        InviteCode:""
      })
    },
    CheckInvite(e) {
      if (this.data.InviteCode == "") {
        return false
      } else
        return true
    },
    BindInviteCodeInput(e){
      this.setData({
        InviteCode:e.detail.value
      })
    },
    BindPasswordInput(e){
      this.setData({
        Password:e.detail.value
      })
    },
    CheckAdmin() {
      if (this.data.Password == "") {
        return false
      } else
        return true
    },
    adminSubmit: async function () { //修改密码
      if (!this.CheckAdmin()) {
        wx.showToast({
          icon: 'none',
          title: '输入为空',
        })
        return
      }
      wx.showLoading({
        title: '修改中',
      })
      const that = this;
      let type = ""
      if (this.data.usertype == "视频团队") {
        type = "VideoAdminPassword"
      } else {
        type = "PhotographyAdminPassword"
      }
      await codeModel.ModifyCode(type, this.data.Password)
      wx.hideLoading();
      wx.showToast({
        title: '修改成功',
      })
      this.setData({
        Password:""
      })
    },
  }
})
