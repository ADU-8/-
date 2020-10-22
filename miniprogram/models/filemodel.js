import {
  HTTP
}
from '../util/http.js'

class FileModel extends HTTP {
  async uploadpic(cloudPath,filePath) {
    const temp = await this.uploadfile({
      cloudPath,filePath
    })
    console.log(temp)
    return temp
  }
}

export {
  FileModel
}