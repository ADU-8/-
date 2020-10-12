const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let content = event.content

  let response = {
    code: 200,
    msg: "无非法内容"
  }

  try{
  	/**
	 * await用于等待一个异步任务执行完成的的结果，根据你的业务需要使用
	 * 调用方法格式：cloud.接口方法		（接口方法会在文档中标明）
	 * 参数、返回、异常等最好查看文档
	 */
    const msgSecCheckResult = await cloud.openapi.security.msgSecCheck({
      content: content
    })
    console.log(msgSecCheckResult)
  } catch (err) {
  	//这个接口风格比较奇特，若检测内容不合法会抛出异常
  	//这里用了try-catch其实好像用Promise风格也是可以的
    console.log("检测不合法")
    response.code = 500
    response.msg = "内容不合法"
    return response
  }
  return response
  //其它的业务逻辑……
}