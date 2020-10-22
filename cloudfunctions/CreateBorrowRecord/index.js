const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    return await db.collection('newrecord').add({
      data: {
        VideoChoosed_list:event.VideoChoosed_list,
        PhotographyChoosed_list:event.PhotographyChoosed_list,
        StartDate:event.StartDate,
        StartTime:event.StartTime,
        EndDate:event.EndDate,
        EndTime:event.EndTime,
        Purpose:event.Purpose,
        BorrowManInfo:event.BorrowManInfo,
        BackStatus:0,
        _openid:event.BorrowManInfo._openid,
        CreateTime:db.serverDate(),
        LastTipDate:event.StartDate,
        LastTipTime:event.StartTime,
        BorrowImgUrl:event.BorrowImgUrl
      }
    });
  } catch (e) {
    console.error(e);
  }
}