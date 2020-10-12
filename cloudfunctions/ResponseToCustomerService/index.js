const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  await cloud.openapi.customerServiceMessage.send({
    touser: wxContext.OPENID,
    msgtype: 'text',
    text: {
      content: '您好，我们已经收到您的消息。将于24小时内回复，如超过24小时无人回复，请直接联系开发者邮箱:1401241918@qq.com',
    },
  })

  return 'success'
}