const {
  RecordModel
} = require("../../models/recordmodel")
const {
  EquipModel
} = require("../../models/equipmodel")
const {
  SubscribeMessageModel
} = require("../../models/subscribemsgmodel")
const recordModel = new RecordModel()
const equipModel = new EquipModel()
const subscribeMsgModel = new SubscribeMessageModel()
// components/recordcard/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    RecordId: String,
    StartDate: String,
    StartTime: String,
    EndDate: String,
    EndTime: String,
    Purpose: String,
    type: String,
    BorrowManInfo: Object,
    Video_list: Array,
    Photo_list: Array,
    BackStatus: Number,
    CardType: {
      type: String,
      value: 'MyRecord'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    loadModal: false,
    Msg1: "视频团队",
    Msg2: "1/",
    Msg3: 1,
    Msg4: "器材归还中:",
    IsReturning: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async ReturnRecord() {
      if (!this.data.IsReturning) {
        this.setData({
          IsReturning:true,
          loadModal: true,
          Msg1: "器材归还中",
          Msg2: "",
          Msg3: "",
          Msg4: "",
        })
        let temp = []

        for (var i = 0; i < this.data.Video_list.length; i++) {
          temp.push(equipModel.ReturnEquip(this.data.Video_list[i]._id))
        }
        for (var i = 0; i < this.data.Photo_list.length; i++) {
          temp.push(equipModel.ReturnEquip(this.data.Photo_list[i]._id))
        }
        Promise.all(temp).then(async res => {
          var returnres = true
          for (var i = 0; i < this.data.Photo_list.length + this.data.Video_list.length; i++) {
            console.log(res[i])
            returnres = returnres && res[i].success
          }
          if (returnres) {
            var ress = await recordModel.ReturnRecord(this.data.RecordId)
            if (ress == 1) {
              this.setData({
                BackStatus: 1,
                loadModal: false,
                IsReturning:false
              })
              await equipModel.GetEquip("Video")
              await equipModel.GetEquip("Photo")
              this.triggerEvent('returnequip', {
                test: 1
              }, {});
              wx.hideLoading()
              wx.showToast({
                title: '归还成功',
              })
              this.SendSubscribeMsg()
            } else {
              this.setData({
                loadModal: false,
                IsReturning:false
              })
              wx.showToast({
                icon: 'none',
                title: '归还记录失败',
              })
            }
          } else {
            this.setData({
              loadModal: false,
              IsReturning:false
            })
            wx.showToast({
              icon: 'none',
              title: '部分归还失败',
            })
          }
        })
      }
    },
    async SendSubscribeMsg() {
      var res = await subscribeMsgModel.SearchSubscribeLog_Record(this.data.RecordId)
      var num = res.result.data.length
      var userinfo = wx.getStorageSync('userInfo')
      var myPhone = userinfo.phone
      for (var i = 0; i < num; i++) {
        await subscribeMsgModel.SendSubscribeMsg(res.result.data[i].borrowMan, num, myPhone)
      }

    },
    async SubscribeRecord() {
      wx.showLoading({
        title: '订阅中',
      })
      var userinfo = wx.getStorageSync('userInfo')
      var myPhone = userinfo.phone
      var res = await subscribeMsgModel.SearchSubscribeLog(myPhone, this.data.RecordId)
      if (res.result.data.length != 0) {
        wx.showToast({
          icon: 'none',
          title: '您已订阅',
        })
      } else {
        await subscribeMsgModel.AddSubscribeLog(this.data.RecordId, "'" + this.data.BorrowManInfo.usertype + '_' + this.data.BorrowManInfo.name + "'", myPhone)
        wx.showToast({
          title: '订阅成功',
        })
      }
    },
    async ForceReturnRecord() {
      this.ReturnRecord()
    },
    call: function (e) {
      wx.makePhoneCall({
        phoneNumber: this.data.BorrowManInfo.phone
      })
    }
  }
})