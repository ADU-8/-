import {
  HTTP
}
  from '../util/http.js'

class SubscribeMessageModel extends HTTP {
  async AddSubscribeLog(recordId, borrowMan, phone) {
    const temp = await this.request({
      name: "AddSubscribeLog",
      data: {
        recordId,
        phone,
        borrowMan
      }
    })
    console.log(temp)
    return temp
  }
  async SearchSubscribeLog(phone,recordId) {
    const temp = await this.request({
      name: "SearchSubscribeLog",
      data: {
        recordId,
        phone
      }
    })
    return temp
  }
  async SearchSubscribeLog_Record(recordId) {
    const res = await this.request({
      name: "SearchSubscribeLog_Record",
      data: {
        recordId
      }
    })
    return res
  }
  async SendSubscribeMsg(borrowMan, num, myphone) {
    const res = await this.request({
      name: "SendSubscribeMsg",
      data: {
        borrowMan, 
        num,
        myphone
      }
    })
    return res
  }
}

export {
  SubscribeMessageModel
}