// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function calculatetime(returndate, returntime, nowdate, nowtime) {
  console.log(returndate, returntime, nowdate, nowtime)
  var time1 = calculatesjc(returndate, returntime)
  var time2 = calculatesjc(nowdate, nowtime)
  return time2 - time1
}

function calculatesjc(date, time) {
  var year = (parseInt(date.substr(0, 4))) * 365 * 24
  var month = (parseInt(date.substr(5, 2))) * 30 * 24
  var day = (parseInt(date.substr(8, 2))) * 24
  var hour = (parseInt(time.substr(0, 2)))
  var min = (parseInt(time.substr(3, 2))) / 60
  return (year + month + day + hour + min)
}
try {
  exports.main = async (event, context) => {
    const res = await db.collection('newrecord').where({
      BackStatus: 0
    }).get();
    console.log(res.data)
    const date = new Date(Date.now() + (8 * 60 * 60 * 1000))
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    console.log(date)
    var nowdate = [year, month, day].map(formatNumber).join('-')
    var nowtime = [hour, minute].map(formatNumber).join(':')
    console.log(nowdate, nowtime)
    res.data.forEach(async function (item, index) {
      const lasttiptime = item.LastTipTime
      const lasttipdate = item.LastTipDate
      const returndate = item.EndDate
      const returntime = item.EndTime
      var during1 = calculatetime(returndate, returntime, nowdate, nowtime)
      var during2 = calculatetime(lasttipdate, lasttiptime, nowdate, nowtime)
      console.log(during1)
      console.log(during2)
      if (during1 > 12 && during2 > 12) {
        var Equip = ""
        if (item.VideoChoosed_list.length != 0) {
          Equip = "‘" + item.VideoChoosed_list[0].equipmentname.substr(0, 8) + "…’"
        } else {
          Equip = "‘" + item.PhotographyChoosed_list[0].equipmentname.substr(0, 8) + "…’"
        }
        console.log(Equip)
        const myphone = item.BorrowManInfo.phone
        const borrowman = item.BorrowManInfo.usertype + "_" + item.BorrowManInfo.name
        const equip = Equip
        const returntimer = returndate.substr(5, 5) + " " + returntime
        const nowtimer = nowdate.substr(5, 5) + " " + nowtime
        const _id = item._id
        const sendres = await cloud.callFunction({
          // 要调用的云函数名称
          name: 'SendReturntips',
          // 传递给云函数的参数
          data: {
            myphone,
            borrowman,
            equip,
            returntime: returntimer,
            nowtime: nowtimer
          }
        })
        console.log(sendres)
        const updateres = await cloud.callFunction({
          // 要调用的云函数名称
          name: 'UpdateRecordLastTip',
          // 传递给云函数的参数
          data: {
            _id,
            nowdate,
            nowtime
          }
        })
        console.log(updateres)
      }

    })
  }
} catch (e) {
  console.log(e)
}