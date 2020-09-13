
// components/equipcard/equipcard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    equipmentname:String,
    status:Number,
    backdate:String,
    backtime:String,
    type:String,
    BorrowManInfo:Object,
    cardType:String,
    ID:Number
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    call: function(e) {
      wx.makePhoneCall({
        phoneNumber: this.data.BorrowManInfo.phone
      })
    },
    Up(){
      this.triggerEvent('Up', {
        ID:this.data.ID
      }, {})
    }
  }
})
