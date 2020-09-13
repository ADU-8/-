// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection("userinformation").doc(event._id).update({
      data: {
        name:event.name,
        phone:event.phone
      }
    })
  } catch (e) {
    console.error(e)
  }
}