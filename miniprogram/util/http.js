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

  uploadfile({
    cloudPath,
    filePath
  }) {
    return new Promise((resolve, reject) => {
      this._uploadfile(cloudPath,filePath, resolve, reject)
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

  _uploadfile(cloudPath,filePath, resolve, reject){
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        console.log('[上传文件] 成功：', res)
        resolve(res)
      },
      fail: err => {
        reject()
        console.error('[上传文件] 失败：', err)
        wx.showToast({
          icon:'none',
          title: '图片上传失败',
        })
      }
    })
  }
}

export {
  HTTP
}