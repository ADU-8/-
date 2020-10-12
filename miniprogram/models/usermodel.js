import {
  HTTP
}
from '../util/http.js'

class UserModel extends HTTP {
  async GetOpenid() {
    const temp = await this.request({
      name: "GetOpenid",
    })
    wx.setStorageSync('userOpenid', temp.result.event.userInfo.openId)
    return temp.result.event.userInfo.openId
  }
  async GetUserInfo(_openid) {
    const temp = await this.request({
      name: "GetUserInfo",
      data: {
        _openid: _openid
      }
    })
    if (temp.result.data.length){
      wx.setStorageSync('userInfo', temp.result.data[0])
      return temp.result.data[0]
    }
    else
      return null
  }

  async RegisterUserInfo(_openid, name, phone, usertype,year) {
    console.log(name, phone)
    if (name == "" || phone == "") {
      wx.showToast({
        icon: 'none',
        title: '信息缺失，注册失败',
      })
      return null
    } else {
      const temp = await this.GetUserInfo(_openid)
      if (!temp) {
        const temp2 = await this.request({
          name: "RegisterUserInfo",
          data: {
            _openid: _openid,
            name: name,
            phone: phone,
            usertype: usertype,
            year:year
          }
        })
        return temp2.result
      }else{
        wx.showToast({
          icon: 'none',
          title: '请勿重复注册',
        })
        return null
      }
    }
  }

  async UpdateUserInfo(_id, name, phone,year) {
    const temp = await this.request({
      name: "UpdateUserInfo",
      data: {
        _id: _id,
        name: name,
        phone: phone,
        year:year
      }
    })
    return temp.result
  }

  async VerifySuccess(_id) {
    const temp = await this.request({
      name: "VerifySuccess",
      data: {
        _id: _id
      }
    })
    return temp.result
  }

  async GetAllUser(_openid) {
    const temp = await this.request({
      name: "GetAllUserInfo",
      data: {

      }
    })
      return temp.result.data
  }

  async DeleteUser(_id) {
    return await this.request({
      name: "DeleteUser",
      data: {
        _id:_id
      }
    })
  }
}

export {
  UserModel
}