const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  try {
      const result = await db.runTransaction(async transaction => {
        await transaction.collection("newequip").doc(event._id).update({
            data: {
              status:_.inc(1)
            }
        })
      const content = await transaction.collection('newequip').doc(event._id).get()
      console.log(content.data.status<0)
      if(content.data.status==1){
        console.log('transaction succeeded')
        return {
          state:"100"
        }
      }else{
        console.log("transcation rollback")
        await transaction.rollback(-100)
      }
    })
    return {
      success: true,
      id:event._id
    }
  } catch (e) {
    console.error('transaction error', e)
    return {
      success: false,
      error: e,
      id:event._id
    }
  }
}