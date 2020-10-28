const {
  EquipModel
} = require("../../models/equipmodel")
const equipModel = new EquipModel()
const {
  RecordModel
} = require("../../models/recordmodel")
const {
  FileModel
} = require("../../models/filemodel")
const recordModel = new RecordModel()
const fileModel = new FileModel()
var util = require('../../util/util.js')
var md5 = require('../../util/md5.js')
var app = getApp()
// miniprogram/pages/borrow/borrow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StartDate: null,
    StartTime: null,
    EndDate: null,
    EndTime: null,
    Today: null,
    DateBorder: null,
    Video_list: [],
    VideoChoosed_list: [],
    Photography_list: [],
    PhotographyChoosed_list: [],
    Purpose: "",
    loadModal: false,
    Msg1: "文本内容安全校验中",
    Msg2: "",
    Msg3: "",
    Msg4: "",
    IsComitting: false,
    Images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.multiple_photo = this.selectComponent("#multiple_photo");
    this.multiple_video = this.selectComponent("#multiple_video");
    var time = util.formatTime(new Date());
    const Video_list = wx.getStorageSync('Equip_Video')
    const Photography_list = wx.getStorageSync('Equip_Photo')
    this.setData({
      StartDate: time[0],
      EndDate: time[0],
      Today: time[0],
      DateBorder: time[1],
      StartTime: time[2],
      EndTime: time[2],
      Video_list: Video_list,
      Photography_list: Photography_list
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: async function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    const Equip_Video = await equipModel.GetEquip("Video");
    const Equip_Photo = await equipModel.GetEquip("Photo");
    this.setData({
      Video_list: Equip_Video,
      Photography_list: Equip_Photo
    })
    this.multiple_photo.updatedata()
    this.multiple_video.updatedata()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: async function () {
    const Equip_Video = await equipModel.GetEquip("Video");
    const Equip_Photo = await equipModel.GetEquip("Photo");
    this.setData({
      Video_list: Equip_Video,
      Photography_list: Equip_Photo
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: async function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: async function () {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    const Equip_Video = wx.getStorageSync('Equip_Video');
    const Equip_Photo = wx.getStorageSync('Equip_Photo');
    this.setData({
      Video_list: Equip_Video,
      Photography_list: Equip_Photo
    })
    this.multiple_photo.updatedata()
    this.multiple_video.updatedata()
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);


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
  async FormSubmit(e) {
    var IsComitting = this.data.IsComitting
    if (IsComitting) {
      return
    }

    if (!app.globalData.IsLogin) {
      wx.showToast({
        icon: 'none',
        title: '请先登录',
      })
      return
    }
    //设置加载框
    this.setData({
      loadModal: true,
      IsComitting: true
    })
    //做表单校验
    console.log(SecCheckRes)
    let FormCheck = this.checkEquip() && this.checkTime() && this.checkPurpose() && this.checkEquipCanbeBorrowOut()
    if (!FormCheck) {
      this.setData({
        loadModal: false,
        IsComitting: false
      })
      return
    }

    //做内容安全校验
    let SecCheckRes = await recordModel.checkMsgSec(this.data.Purpose);
    let SecCheck = SecCheckRes.result.code
    if (SecCheck == "500") {
      wx.showToast({
        icon: 'none',
        title: '用途简介中有非法内容!',
      })
      this.setData({
        loadModal: false,
        IsComitting: false
      })
      return
    }
    //如果校验均通过，开始借用器材
    if (FormCheck) {
      this.setData({
        Msg1: "器材校验中"
      })

      let VideoChoosed_listLength = this.data.VideoChoosed_list.length
      let PhotographyChoosed_listLength = this.data.PhotographyChoosed_list.length
      const BorrowManInfo = wx.getStorageSync('userInfo')
      var SuccessVideoChoosed_list = []
      var SuccessPhotographyChoosed_list = []
      var FailVideoChoosed_list = []
      var FailPhotographyChoosed_list = []
      //借用器材
      var that = this

      //借用视频团队器材
      var temp = []
      for (var i = 0; i < VideoChoosed_listLength; i++) {
        temp.push(equipModel.BorrowEquip(this.data.VideoChoosed_list[i]._id, that.data.EndDate, that.data.EndTime, BorrowManInfo))
      }
      //借用摄影部器材
      for (var i = 0; i < PhotographyChoosed_listLength; i++) {
        temp.push(equipModel.BorrowEquip(this.data.PhotographyChoosed_list[i]._id, that.data.EndDate, that.data.EndTime, BorrowManInfo))
      }
      //若所有Promise均已返回，修改
      Promise.all(temp).then(async res => { //第一层
        //获取器材借用结果
        for (var i = 0; i < VideoChoosed_listLength; i++) {
          console.log("that.data.VideoChoosed_list[i]", that.data.VideoChoosed_list[i])
          for (var j = 0; j < VideoChoosed_listLength + PhotographyChoosed_listLength; j++) {
            if (that.data.VideoChoosed_list[i]._id == res[j].id) {
              if (res[j].success) {
                SuccessVideoChoosed_list.push(that.data.VideoChoosed_list[i])
              } else {
                FailVideoChoosed_list.push(that.data.VideoChoosed_list[i])
              }
            }
          }
        }

        for (var i = 0; i < PhotographyChoosed_listLength; i++) {
          for (var j = 0; j < VideoChoosed_listLength + PhotographyChoosed_listLength; j++) {
            if (that.data.PhotographyChoosed_list[i]._id == res[j].id) {
              if (res[j].success) {
                SuccessPhotographyChoosed_list.push(that.data.PhotographyChoosed_list[i])
              } else {
                FailPhotographyChoosed_list.push(that.data.PhotographyChoosed_list[i])
              }
            }
          }
        }
        //记录成功借用器材与失败借用器材
        that.setData({
          PhotographyChoosed_list: SuccessPhotographyChoosed_list,
          VideoChoosed_list: SuccessVideoChoosed_list
        })
        //创建记录
        if (that.data.Images.length != 0) {
          that.setData({
            Msg1: "上传器材图片中",
          })
        }
        //创建租借记录
        if (this.data.VideoChoosed_list.length != 0 || this.data.PhotographyChoosed_list != 0) {
          var temp = []
          //如果有器材借用成功，上传相应图片
          if (that.data.Images.length != 0) {
            that.data.Images.forEach(function (value, index) {
              const filePath = value;
              const userid = wx.getStorageSync('userInfo')._openid
              const cloudPath = userid + '/' + md5.hex_md5(that.data.EndDate + that.data.StartDate + that.data.EndTime) + '/image' + index + filePath.match(/\.[^.]+?$/);
              console.log("cloudPath", cloudPath)
              console.log("filePath", filePath)
              temp.push(fileModel.uploadpic(cloudPath, filePath))
            })
          }
          var imgurl = []
          //等待所有图片上传完成后进行下一步操作
          Promise.all(temp).then(async res => {
            //第二层等待Promise，获得所有图片上传的结果及url
            for (var i = 0; i < temp.length; i++) {
              console.log(i, res[i])
              imgurl.push(res[i].fileID)
            }
            console.log("inner")
            //增加借用记录
            that.setData({
              Msg1: "新增借用记录中",
            })
            await recordModel.CreateBorrowRecord(that.data.VideoChoosed_list, that.data.PhotographyChoosed_list, that.data.StartDate, that.data.StartTime, that.data.EndDate, that.data.EndTime, that.data.Purpose, BorrowManInfo, imgurl)
            console.log("inner2")
            this.setData({
              loadModal: false,
              IsComitting: false
            })
            //判断是所有器材租借成功还是部分器材租界成功
            if (FailVideoChoosed_list.length + FailPhotographyChoosed_list.length == 0) {
              wx.showToast({
                title: '租借成功!',
              })
            } else {
              wx.showToast({
                icon: 'none',
                title: '部分器材租借成功！',
              })
            }
            //延时跳转页面，让用户更为清晰的认知到借用结果
            setTimeout(function () {
              that.ClearPageInfo()
              wx.switchTab({
                url: '../myrecord/myrecord',
              })
            }, 1500)
          })
        } else {
          //如无任何器材借用成功，则显示如下提示信息
          this.setData({
            loadModal: false,
            IsComitting: false
          })
          wx.showToast({
            icon: 'none',
            title: '所有器材都被别人抢先借用啦，请刷新重试',
          })
          that.onPullDownRefresh()
          that.ClearPageInfo()
        }
      })
    }
  },
  ClearPageInfo() {
    this.setData({
      VideoChoosed_list: [],
      PhotographyChoosed_list: [],
      Purpose: "",
      Images: []
    })
  },
  checkEquip: function () {
    if (this.data.VideoChoosed_list.length == 0 && this.data.PhotographyChoosed_list.length == 0) {
      wx.showToast({
        title: "你还未选择器材",
        icon: 'none',
        duration: 1500
      })
      return false
    } else {
      return true
    }
  },
  checkEquipCanbeBorrowOut: function () {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo.usertype == "摄影部") {
      console.log(111)
      for (var i = 0; i < this.data.VideoChoosed_list.length; i++) {
        if (this.data.VideoChoosed_list[i].CanbeBorrowOut == false) {
          wx.showToast({
            title: "器材" + this.data.VideoChoosed_list[i].equipmentname + '为该部门不可外借器材，请取消选择',
            icon: 'none',
            duration: 1500
          })
          return false
        }
      }
    } else {
      for (var i = 0; i < this.data.PhotographyChoosed_list.length; i++) {
        if (this.data.PhotographyChoosed_list[i].CanbeBorrowOut == false) {
          wx.showToast({
            title: "器材" + this.data.PhotographyChoosed_list[i].equipmentname + '为该部门不可外借器材，请取消选择',
            icon: 'none',
            duration: 1500
          })
          return false
        }
      }
    }
    return true
  },
  checkPurpose: function (e) {
    console.log(e)
    if (this.data.Purpose == "") {
      wx.showToast({
        title: "你还未填写用途",
        icon: 'none',
        duration: 1500
      })
      return false
    } else {
      return true
    }
  },
  checkTime: function () {
    if (this.data.StartDate == this.data.EndDate) {
      if (this.data.StartTime < this.data.EndTime) {
        return true
      } else {
        wx.showToast({
          icon: 'none',
          title: '时间有误',
        })
        return false
      }
    } else if (this.data.StartDate < this.data.EndDate) {
      return true;
    } else {
      wx.showToast({
        icon: 'none',
        title: '时间有误',
      })
      return false
    }
  },
  multipleCancel_photo() {
    this.multiple_photo.hideMultiple();
  },
  multipleCancel_video() {
    this.multiple_video.hideMultiple();
  },
  //确认事件
  multipleConfirm_photo(e) {
    console.log('获取选中的项==', e.detail);
    this.setData({
      PhotographyChoosed_list: e.detail,
    })
    this.multiple_photo.hideMultiple();
  },
  multipleConfirm_video(e) {
    console.log('获取选中的项==', e.detail);
    this.setData({
      VideoChoosed_list: e.detail,
    })
    this.multiple_video.hideMultiple();
  },
  showMultiple_photo: function () {
    if (!app.globalData.IsLogin) {
      wx.showToast({
        icon: 'none',
        title: '请先登录',
      })
      return
    }
    this.multiple_photo.showMultiple();
  },
  showMultiple_video: function () {
    if (!app.globalData.IsLogin) {
      wx.showToast({
        icon: 'none',
        title: '请先登录',
      })
      return
    }
    this.multiple_video.showMultiple();
  },
  BindPurposeInput(e) {
    this.setData({
      Purpose: e.detail.value
    })
    console.log(e)
  },
  BindStartDateChange(e) {
    this.setData({
      StartDate: e.detail.value
    })
  },
  BindStartTimeChange(e) {
    this.setData({
      StartTime: e.detail.value
    })
  },
  BindEndDateChange(e) {
    this.setData({
      EndDate: e.detail.value
    })
  },
  BindEndTimeChange(e) {
    this.setData({
      EndTime: e.detail.value
    })
  },

  chooseImage: function () {
    var that = this;
    // 选择图片

    // wx.chooseVideo({
    //   sizeType: ['compressed'],
    //   sourceType: ['album', 'camera'],
    //   success: function (res) {
    //     console.log("res", res)
    //     var images = []
    //     images.push(res.tempFilePath);
    //     console.log("image", images)
    //     that.setData({
    //       Images: images
    //     })
    //     console.log("image2", that.data.images)
    //   },
    //   fail: e => {
    //     console.error(e)
    //   }
    // })
    var len = 4 - this.data.Images
    wx.chooseImage({
      count: len,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log("res", res)
        var images = that.data.Images
        console.log(images)
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
    var id = e.currentTarget.dataset.id;
    console.log(this.data.Images)
    this.data.Images.splice(id, 1);
    console.log(this.data.Images)
    this.setData({
      Images: this.data.Images
    })
  },
  HandleImagePreview(e) {
    console.log("Handle", e)
    const index = e.currentTarget.dataset.index
    const images = this.data.Images
    wx.previewImage({
      current: images[index], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },

})