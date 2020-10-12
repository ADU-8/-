const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    return await db.collection('userinformation').add({
      data: {
        _openid: event._openid,
        name:event.name,
        phone:event.phone,
        usertype:event.usertype,
        IsVerified:0,
        year:event.year
      }
    });
  } catch (e) {
    console.error(e);
  }
}