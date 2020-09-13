// components/adminverify/index.js
const md5 = require('../../util/md5.js')
const {
  UserModel
} = require('../../models/usermodel.js')
const userModel = new UserModel()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    usertype: {
      type: String,
      value: "视频团队"
    },
    IsVerified: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    IsInviteCodeCorrect: 0,
    IsPasswordShow: 0,
    IsVerifying: 0,
    IsVerified: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal() {
      this.setData({
        IsVerifying: 1
      })
    },
    hideModal() {
      this.setData({
        IsVerifying: 0
      })
    },
    CheckInvitationCode(e) {
      const InputCode = md5.hex_md5(e.detail.value)
      const VideoAdminPassword = wx.getStorageSync('VideoAdminPassword')
      const PhotographyAdminPassword = wx.getStorageSync('PhotographyAdminPassword')
      if (this.data.usertype == "视频团队") {
        if (InputCode == VideoAdminPassword) {
          this.setData({
            IsInviteCodeCorrect: 1
          })
          this.VerifySuccess()
        } else {
          this.setData({
            IsInviteCodeCorrect: 0
          })
        }
      } else {
        if (InputCode == PhotographyAdminPassword) {
          this.setData({
            IsInviteCodeCorrect: 1
          })
          this.VerifySuccess()
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
    async VerifySuccess() {
      const userInfo = wx.getStorageSync('userInfo')
      this.hideModal();
      wx.showToast({
        title: '认证中',
      })
      if (await userModel.VerifySuccess(userInfo._id)) {
        wx.showToast({
          title: '认证成功',
        })
      }
      this.setData({
        IsVerified: true
      })
      await userModel.GetUserInfo(userInfo._openid)
      this.triggerEvent('verifysuccess',{},{})
    }
  }
})