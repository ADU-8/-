import {
  HTTP
}
from '../util/http.js'
const md5 = require('../util/md5.js')

class EquipModel extends HTTP {
  async GetEquip(type) {
    console.log(type)
    const temp = await this.request({
      name: "GetEquip",
      data:{
        type:type
      }
    })
    if(type=="Video")
      wx.setStorageSync('Equip_Video',temp.result.data)
    else{
      wx.setStorageSync('Equip_Photo',temp.result.data)
    }
    return temp.result.data
  }

  async CheckEquip(_id) {
    console.log(_id)
    const temp = await this.request({
      name: "CheckEquip",
      data:{
        _id:_id
      }
    })
    console.log(temp)
    if(temp.result.data.status == 1){
      return true
    }else{
      return false
    }
  }

  async BorrowEquip(_id,EndDate,EndTime,BorrowManInfo) {
    console.log(_id,EndDate,EndTime,BorrowManInfo)
    const temp = await this.request({
      name: "BorrowEquip",
      data:{
        _id:_id,
        EndDate,
        EndTime,
        BorrowManInfo
      }
    })
    console.log(temp)
    return temp.result
  }
  async ReturnEquip(_id) {
    console.log(_id)
    const temp = await this.request({
      name: "ReturnEquip",
      data:{
        _id:_id,
      }
    })
    return temp.result
  }

  async AddNewEquip(name,type,BorrowOut) {
    return await this.request({
      name: "AddNewEquip",
      data:{
        name:name,
        type:type,
        BorrowOut:BorrowOut
      }
    })
  }

  async DeleteEquip(_id) {
    return await this.request({
      name: "DeleteEquip",
      data:{
        _id:_id
      }
    })
  }
}

export {
  EquipModel
}