const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    return await db.collection('newequip').doc(event._id).update({
      data: {
        status:0,
        BorrowManInfo:event.BorrowManInfo,
        backdate:event.EndDate,
        backtime:event.EndTime,
      },
      success: function(res) {
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}