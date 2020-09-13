// components/adminequip/index.js
const {
  EquipModel
} = require("../../models/equipmodel");
// miniprogram/pages/login/collegestudents/collegestudents.js
const equipModel = new EquipModel()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    usertype:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    EquipCheck: 1,
    EquipName:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    Equipradiochange: function (res) {
      const value = res.detail.value
      if (value == 'true') {
        this.setData({
          EquipCheck: 1
        })
      } else if (value == 'false') {
        this.setData({
          EquipCheck: 2
        })
      }
    },
    async AddEquip() {
      if (!this.CheckEquip()) {
        wx.showToast({
          icon: 'none',
          title: '输入为空',
        })
        return
      }
      wx.showLoading({
        title: '设备添加中',
      })
      let type = "Photo"
      if (this.data.usertype == '视频团队') {
        type = "Video"
      }
      var BorrowOut = true;
      if (this.data.EquipCheck == 2) {
        BorrowOut = false
      }
      await equipModel.AddNewEquip(this.data.EquipName, type, BorrowOut)
      wx.hideLoading()
      const AllEquip_Video = await equipModel.GetEquip('Video');
      const AllEquip_Photo = await equipModel.GetEquip('Photo');
      wx.setStorageSync('Equip_Video', AllEquip_Video)
      wx.setStorageSync('Equip_Photo', AllEquip_Photo)
      wx.showToast({
        title: '添加成功',
      })
      this.setData({
        EquipName:""
      })
    },
    CheckEquip(e) {
      if (this.data.EquipName == "") {
        return false
      } else
        return true
    },
    goDelete() {
      wx.navigateTo({
        url: '../deleteequip/deleteequip',
      })
    },
    BindEquipNameChange(e){
      this.setData({
        EquipName:e.detail.value
      })
    },
    GoUser: function () {
      wx.navigateTo({
        url: '../alluserinfo/alluserinfo'
      })
    },
  }
})
