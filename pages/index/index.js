//index.js
//获取应用实例
import { JJRequest } from '../../utils/util.js'
const app = getApp()

Page({
  data: {
    motto: '笺笺登陆中...',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
      this.userLogin();
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        this.userLogin();
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.userLogin();
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  userLogin: function() {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          JJRequest({
            url: 'http://111.230.135.232:3000/api/user/login',
            data: {
              code: res.code,
              nickname: that.data.userInfo.nickName,
              avatar: that.data.userInfo.avatarUrl
            },
            method: 'POST',
            success: function (res) {
              if (res.data.status == "OK") {
                console.log("登陆成功");
                wx.switchTab({
                  url: '/pages/Main/Main',
                })
              } else {
                that.setData({
                  motto: "登录失败，请重试"
                })
                console.log('fail to login');
                console.log(res);
              }
            },
            fail: function (res) {
              // don't know what to do yet.....
              that.setData({
                motto: "登录失败，请重试"
              })
              console.log('fail to login');
              console.log(res);
            }

          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  }
})
