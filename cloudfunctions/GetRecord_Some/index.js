const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const countResult = await db.collection('newrecord').where({
      StartDate:_.gte(event.StartDate)
    }).count()
    const total = countResult.total
    let start = event.start
    let limit = event.limit
    let skip = total-start-limit
    return await db.collection('newrecord').where({
      StartDate:_.gte(event.StartDate)
    }).orderBy('CreateTime','desc').skip(start).limit(limit).get({
      success: function(res) {
        return res
      }
    });
  } catch (e) {
    console.error(e);
  }
}