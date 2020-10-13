const { EquipModel } = require("../../models/equipmodel")
const equipModel = new EquipModel()
// miniprogram/pages/deleteequip/deleteequip.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AllEquip_Video: [],
    AllEquip_Photo: [],
    usertype:"视频团队",
    IsSearch:false,
    searchEquip_Photo:[],
    searchEquip_Video:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    const AllEquip_Video = wx.getStorageSync('Equip_Video')
    const AllEquip_Photo = wx.getStorageSync('Equip_Photo')
    this.setData({
      AllEquip_Video,
      AllEquip_Photo,
      usertype:userInfo.usertype
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
  async DeleteEquip(e){
    console.log(e)
    const _id = e.currentTarget.dataset.item._id
    const status = e.currentTarget.dataset.item.status
    if(status == 0){
      wx.showToast({
        icon:'none',
        title: '请先归还该设备再删除',
      })
      return
    }
    wx.showLoading({
      title: '删除中',
    })
    await equipModel.DeleteEquip(_id);

    wx.hideLoading()
    const AllEquip_Video = await equipModel.GetEquip('Video');
    const AllEquip_Photo = await equipModel.GetEquip('Photo');
    wx.setStorageSync('Equip_Video',AllEquip_Video)
    wx.setStorageSync('Equip_Photo',AllEquip_Photo)
    this.setData({
      AllEquip_Video,
      AllEquip_Photo
    })

    wx.showToast({
      title: '删除成功',
    })
  },
  Up(event){
    console.log(event)
  },
  BindfocusSearchEquip() {
    this.setData({
      IsSearch: true
    })
  },
  searchEquip(e) { //按下软键盘确认进行搜索
    //存储搜索历史
    this.Search(e.detail.value)
  },
  Search(text) { //搜索主函数
    let searchEquip_Video = []
    let searchEquip_Photo = []
    var that = this
    this.data.AllEquip_Video.forEach(function (item, index) {
      if (that.countSubstr(item.equipmentname, text) != 0) {
        searchEquip_Video.push(item)
      }
    })
    this.data.AllEquip_Photo.forEach(function (item, index) {
      if (that.countSubstr(item.equipmentname, text) != 0) {
        searchEquip_Photo.push(item)
      }
    })
    this.setData({
      searchEquip_Photo,
      searchEquip_Video
    })

  },
  countSubstr(str, substr) {
    var reg = new RegExp(substr, "g");
    return str.match(reg) ? str.match(reg).length : 0; //若match返回不为null，则结果为true，输出match返回的数组(["test","test"])的长度
  },
  HideSearchEquip() {
    this.setData({
      IsSearch: false,
      SearchRes: []
    })
  },
  

})