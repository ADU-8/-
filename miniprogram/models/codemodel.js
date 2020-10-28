import {
  HTTP
}
from '../util/http.js'
const md5 = require('../util/md5.js')
const TypeForm = {
  'VideoInvitationCode': "d68532785e2bc3f2058cc906468bd883",
  'VideoAdminPassword': "d68532785e355e4a08e1d5a85bab94ea",
  'PhotographyInvitationCode': 'abd27dd45f2a1332000d1f2027612085',
  'PhotographyAdminPassword': 'abd27dd45f2a14b6000d2fd238047adb'
}
class CodeModel extends HTTP {
  
  async ModifyCode(type,code) {
    console.log(type)
    return await this.request({
      name: "ModifyCode",
      data: {
        _id:TypeForm[type],
        code:code
      }
    })
  }

  async GetCode(type) {
    console.log(type)
    const temp = await this.request({
      name: "GetCode",
      data: {
        type: type
      }
    })
    return md5.hex_md5(temp.result.data[0].code)
  }

  async SendError(name,phone,usertype,openid) {
    return await this.request({
      name: "SendError",
      data: {
        name,
        phone,
        usertype,
        openid
      }
    })
  }
}

export {
  CodeModel
}