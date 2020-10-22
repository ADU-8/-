const {
  RecordModel
} = require("../../models/recordmodel")
const {
  EquipModel
} = require("../../models/equipmodel")
const {
  SubscribeMessageModel
} = require("../../models/subscribemsgmodel")
const {
  FileMessageModel, FileModel
} = require("../../models/filemodel")
const recordModel = new RecordModel()
const equipModel = new EquipModel()
const subscribeMsgModel = new SubscribeMessageModel()
const fileModel = new FileModel()
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
    IsReturning: false,
    loadModal2: false,
    Images: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async ReturnRecord() {
      if (!this.data.IsReturning) {
        this.setData({
          IsReturning: true,
          loadModal: true,
          Msg1: "器材归还中",
          Msg2: "",
          Msg3: "",
          Msg4: "",
        })
        let temp = []

        var that = this
        if(this.data.Images.length==0){
          this.setData({
            IsReturning: false,
            loadModal: false,
          })
          wx.showToast({
            icon:'none',
            title: '还未上传图片',
          })
          
          return
        }

        for (var i = 0; i < this.data.Video_list.length; i++) {
          temp.push(equipModel.ReturnEquip(this.data.Video_list[i]._id))
        }
        for (var i = 0; i < this.data.Photo_list.length; i++) {
          temp.push(equipModel.ReturnEquip(this.data.Photo_list[i]._id))
        }
        var successEquip = []
        Promise.all(temp).then(async res => {
          var returnres = true
          for (var i = 0; i < this.data.Video_list.length; i++) {
            for(var j=0;j<res.length;j++){
              if(this.data.Video_list[i]._id == res[j].id){
                returnres = returnres && res[j].success      
                if(res[j].success){
                  successEquip.push(res[j].id)
                }
              }
            }
            console.log(res[i])
            
          }
          for (var i = 0; i < this.data.Photo_list.length; i++) {
            for(var j=0;j<res.length;j++){
              if(this.data.Photo_list[i]._id == res[j].id){
                returnres = returnres && res[j].success  
                if(res[j].success){
                  successEquip.push(res[j].id)
                }
              }
            }
            console.log(res[i])
          }

          if (returnres) {
            that.setData({
              Msg1:"上传图片中"
            })
            var temp = []
            //如果器材全部归还成功，上传相应图片
            that.data.Images.forEach(function (value, index) {
              const filePath = value;
              const userid = wx.getStorageSync('userInfo')._openid
              const cloudPath = userid + '/' + that.data.RecordId +'/image' + index + filePath.match(/\.[^.]+?$/);
              console.log("cloudPath", cloudPath)
              console.log("filePath", filePath)
              temp.push(fileModel.uploadpic(cloudPath, filePath))
            })
            var imgurl = []
            //等待所有图片上传完成后进行下一步操作
            Promise.all(temp).then(async res => {
              //第二层等待Promise，获得所有图片上传的结果及url
              for (var i = 0; i < temp.length; i++) {
                console.log(i, res[i])
                if (res[i].statusCode == 200) { //成功
                  imgurl.push(res[i].fileID)
                }
              }
              that.setData({
                Msg1:"归还借用记录中"
              })
              var ress = await recordModel.ReturnRecord(this.data.RecordId, imgurl)
              if (ress == 1) {
                this.setData({
                  BackStatus: 1,
                  loadModal2: false,
                  loadModal: false,
                  IsReturning: false
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
                  loadModal2: false,
                  loadModal: false,
                  IsReturning: false
                })
                wx.showToast({
                  icon: 'none',
                  title: '归还记录失败',
                })
              }
            })

          } else {
            this.setData({
              Msg1:'归还失败',
              Msg2:'正在回滚数据'
            })
            var temp = []
            successEquip.forEach(function(item,index){
              console.log(item)
              temp.push(equipModel.RollBackEquip(item))
            })
            Promise.all(temp).then(res=>{
              that.setData({
                loadModal: false,
                IsReturning: false
              })
              wx.showToast({
                icon:'none',
                title: '归还失败，请重试或联系客服',
              })
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
    },
    ReturnRecord2() {
      this.setData({
        loadModal2: true
      })
    },
    chooseImage: function () {
      var that = this;
      // 选择图片
      wx.chooseImage({
        count: 4,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          console.log("res", res)
          var images = []
          res.tempFilePaths.forEach(function (item, index) {
            console.log("item", item);
            images.push(item);
          })
          console.log("image", images)
          that.setData({
            Images: images
          })
          console.log("image2", that.data.Images)
        },
        fail: e => {
          console.error(e)
        }
      })
    },
    RemoveImage(e) {
      var index = e.target.dataset.index;
      this.data.Images.splice(index, 1);
      this.setData({
        Images: this.data.Images
      })
    },
    HandleImagePreview(e) {
      const index = e.target.dataset.index
      const images = this.data.Images
      wx.previewImage({
        current: images[index], //当前预览的图片
        urls: images, //所有要预览的图片
      })
    },
    HideModal2(){
      this.setData({
        loadModal2:false
      })
    }
  }
})