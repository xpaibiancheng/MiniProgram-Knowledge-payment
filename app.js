// app.js
App({
// 引入富士文本
  towxml:require('/towxml/index'),
  onLaunch(options) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 初始化云环境

    wx.cloud.init({
        env:'mamengkeji-9g3i82pg37b59653'
    })
    // 打印openid
    wx.cloud.callFunction({
        name:'openid',
        success:(res)=>{
            console.log('app.js打印openid:',res.result.event.userInfo.openId);
            this.globalData.openid=res.result.event.userInfo.openId
            // 检测会员状态
            if(wx.getStorageSync('userInfo').vipFlag==1){
                wx.cloud.database().collection('userinfo').where({
                    _openid:res.result.event.userInfo.openId
                }).get({
                    success(resp){
                        if(resp.data[0].vipFlag!=wx.getStorageSync('userInfo').vipFlag){
                            var temp = wx.getStorageSync('userInfo')
                            temp.vipFlag=resp.data[0].vipFlag
                            wx.setStorageSync('userInfo', temp)
                        }
                    }
                })
            }
        }
    })
  },
  onGetSysInfo() {
    let isiPhoneX = wx.getStorageSync('isiPhoneX') || false
    if (!isiPhoneX) {
      wx.getSystemInfo({
        complete: (res) => {
          let modelmes = res.model;
          if (modelmes.indexOf('iPhone X') != -1) {
            // 存储型号
            this.globalData.isiPhoneX = true
            wx.setStorageSync('isiPhoneX', true)
            // 加入回调
            this.sysCallback && this.sysCallback()
          }
        },
      })
    }else{
      this.globalData.isiPhoneX = isiPhoneX
    }
  },
  globalData: {
    openid:'',
    appCodePro:'',
    appWebView:'',
    userInfo: null
  }
})
