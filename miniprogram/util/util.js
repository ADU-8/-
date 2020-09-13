const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [
    [year, month, day].map(formatNumber).join('-'),
    [year+5, month, day].map(formatNumber).join('-'),
    [hour, minute].map(formatNumber).join(':'),
  ]
}
const getOneweekdate = date => {
 
  var oneweekdate = new Date(date-7*24*3600*1000);
  const year = oneweekdate.getFullYear()
  const month = oneweekdate.getMonth() + 1
  const day = oneweekdate.getDate()
  return [
    [year, month, day].map(formatNumber).join('-'),
  ]
}
const getOnemonthdate = date => {
 
  var onemonthdate = new Date(date-30*24*3600*1000);
  const year = onemonthdate.getFullYear()
  const month = onemonthdate.getMonth() + 1
  const day = onemonthdate.getDate()
  return [
    [year, month, day].map(formatNumber).join('-')
  ]
  
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  getOneweekdate:getOneweekdate,
  getOnemonthdate:getOnemonthdate
}
