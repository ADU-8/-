// miniprogram/pages/updatelog/updatelog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    VersionInfo: [
    {
        "Version": "V1.3.0",
        "Content": ["1、新增版本更新日志记录", 
                    "2、大幅优化器材借还速度，首页数据加载速度", 
                    "3、新增电话一键拨打功能，点击借用记录上借用者的电话将一键进入电话拨打界面",
                    "4、后台记录数据查询速度优化，分批次查询记录数据",
                    "5、后台入口UI优化调整",
                    "6、修复部分手机号无法注册的问题"]
    },  
    {
      "Version": "V1.2.1",
      "Content": ["1、新增记录订阅功能：可在出借记录处订阅他人正在使用的器材记录，当他人归还时，您将收到短信提示", 
                  "2、新增版本介绍功能", ]
    }, 
    {
      "Version": "V1.2.0",
      "Content": ["1、优化器材借还并发度，提高借还速度", 
                  "2、新增器材借还进度加载条", ]
    }, 
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})