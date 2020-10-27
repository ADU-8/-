# QSCamera 程序功能简介

可用于公司、组织的器材借还系统，支持管理员认证及记录的查询管理，自定义器材密码管理。

# QSCamera 程序开发简介

本微信小程序 QscCamera 前端由原生小程序 html\css\javascript 开发，采用 colorui 库进行 UI 设计，后端采用微信云开发数据库，80%页面采用组件化开发手段，可扩展性与可维护性强。所有云函数网络请求是经过 util 文件夹中的 http.js 进行二次封装，由 models 中的相应模块进行调用，采用 Promise，async 和 await 完美解决异步网络请求的问题。如果对异步转同步有需求的详见 util/http.js 中的 HTTP 类。

## 使用文档

详见 根目录下 QSCamera 使用文档

## 开发文档

详见 根目录下 QSCamera 开发文档

# 作者：

Fantast（Shen Lvkesheng）

# 个人主页：

https://github.com/Fantast416

# 项目地址：

https://github.com/Fantast416/WxApp_QsCamera

# 版本更迭：

V1.0.0 2020/8/7
V1.1.0 2020/8/23 新增注册功能手机验证码验证，采用腾讯云短信发送服务，依赖 npm install ，使用相关的 SDK ，进行二次 封装后使用
V1.2.0 2020/8/30 见小程序updatelog页面
V1.2.1 2020/9/10 见小程序updatelog页面
V1.3.0 2020/9/13 见小程序updatelog页面
V1.3.1 2020/9/18 见小程序updatelog页面
V1.4.0 2020/9/30 见小程序updatelog页面
V1.4.1 2020/10/06 见小程序updatelog页面
V1.4.2 2020/10/11 见小程序updatelog页面
V1.5.0 2020/10/27 见小程序updatelog页面