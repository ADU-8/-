// # 解构
class HTTP {
  request({
    name,
    data = {},
  }) {
    return new Promise((resolve, reject) => {
      this._request(name, resolve, reject, data)
    })
  }
  _request(name, resolve, reject, data = {}) {
    wx.cloud.callFunction({
      name: name,
      data: data,
      success: res => {
        console.log("CloudFunction_"+name+"_Called Success")
        resolve(res)
      },
      fail: err => {
        reject()
        console.log("CloudFunction_"+name+"_Called Failed")
        wx.showToast({
          icon:'none',
          title: '很抱歉，出现了一个错误，请重试',
        })
      }
    })

  }

}

export {
  HTTP
}