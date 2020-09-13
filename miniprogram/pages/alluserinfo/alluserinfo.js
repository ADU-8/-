const {
  UserModel
} = require("../../models/usermodel")

// miniprogram/pages/alluserinfo/alluserinfo.js
const userModel = new UserModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AllUser: [],
    SwitchType:true //true为视频团队，false为摄影部
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.showLoading({
      title: '加载中',
    })
    const AllUser = await userModel.GetAllUser()
    this.setData({
      AllUser
    })
    wx.hideLoading({
      success: (res) => {},
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
  async DeleteUser(e) {
    wx.showLoading({
      title: '删除中',
    })
    await userModel.DeleteUser(e.target.dataset.id)
    const AllUser = await userModel.GetAllUser()
    this.setData({
      AllUser
    })
    wx.hideLoading()
    wx.showToast({
      title: '删除成功',
    })
  },
  bindCopy() {
    var result = "序号,部门,姓名,手机号\n";
    this.data.AllUser.forEach(function (value, index) {
      result += (index + '、' + value.usertype + ',' + value.name + ',' + value.phone + '\n');
    });
    wx.setClipboardData({
      data: result,
      success: function (res) {
        wx.showToast({
          title: '已复制到剪贴板',
        })
      }
    });
  },
  changeSwitch(e) {
    console.log(e)
    this.setData({
      SwitchType: e.detail.value
    })
  },
})

