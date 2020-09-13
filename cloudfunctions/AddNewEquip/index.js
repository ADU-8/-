const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    return await db.collection('newequip').add({
      data: {
        backdate: "",
        backtime: "",
        BorrowManInfo: {},
        equipmentname: event.name,
        CanbeBorrowOut:event.BorrowOut,
        status: 1,
        type:event.type
      }
    });
  } catch (e) {
    console.error(e);
  }
}