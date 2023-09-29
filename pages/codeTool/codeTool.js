// pages/tool/tool.js
const app =getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailRows:[]
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //是否有人邀请
        if(!wx.getStorageSync('inviteOpenid') && options.openid){
            wx.setStorageSync('inviteOpenid',options.openid)
        }
        console.log('code页面',options);
        wx.showLoading({
          title: '加载中',
        })
        wx.cloud.callFunction({
            name:'webNav',
            success:(res)=>{
                console.log(res.result);
                this.setData({
                    detailRows:res.result.data
                })
                wx.hideLoading()
            },fail:(res)=>{
                console.log(res);
                wx.hideLoading()
            }
        })
    },
    /* 进制转换 */
    bindToCode(){
      wx.navigateTo({
        url: '/pages/jinzhi/jinzhi',
      })
    },
    /* 网站获取 */
    bindCollection(e){
      console.log(e.currentTarget.dataset.url);
      var url=e.currentTarget.dataset.url
      var index =e.currentTarget.dataset.index
      var vipFlag = this.data.detailRows[index].vip
      if(vipFlag){
          if(wx.getStorageSync('userInfo').vipFlag == 1){
                wx.showModal({
                    title:'快速打开',
                    content:'点击确定快速打开，点击取消，一键复制网址',
                    success(res){
                    if(res.confirm){
                            app.globalData.appWebView = url
                            wx.navigateTo({
                            url: '/pages/gongzhongView/gongzhongView',
                            })
                    }if(res.cancel){
                        wx.setClipboardData({//复制文本
                            data: url,
                            success: function (e) {
                            wx.getClipboardData({//获取复制文本
                                success: function (e) {
                                wx.showToast({
                                    title:'复制成功',
                                    icon:"success",//是否需要icon
                                    mask:"ture"//是否设置点击蒙版，防止点击穿透
                                })
                                }
                            })
                            }
                        })
                    }
                    }
                })
          }else{
             wx.showModal({
               title: '您似乎还不是会员',
               content: '此为会员资源，是否开通会员？',
               complete: (res) => {
                 if (res.cancel) {
                   
                 }
             
                 if (res.confirm) {
                    wx.navigateTo({
                      url: '/pages/vipBuy/vipBuy',
                    })
                 }
               }
             })
          }
      }else{
        wx.showModal({
            title:'快速打开',
            content:'点击确定快速打开，点击取消，一键复制网址',
            success(res){
              if(res.confirm){
                    app.globalData.appWebView = url
                    wx.navigateTo({
                      url: '/pages/gongzhongView/gongzhongView',
                    })
              }if(res.cancel){
                wx.setClipboardData({//复制文本
                    data: url,
                    success: function (e) {
                      wx.getClipboardData({//获取复制文本
                        success: function (e) {
                          wx.showToast({
                            title:'复制成功',
                            icon:"success",//是否需要icon
                            mask:"ture"//是否设置点击蒙版，防止点击穿透
                          })
                        }
                      })
                    }
                  })
              }
            }
          })
      }
      
    },
    /* 分享 */
     /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage']
        });
        // 传递的参数
        const openid= app.globalData.openid
        return {
            title:'码梦网络实用网站大全',
            path: 'pages/codeTool/codeTool?openid='+openid,
            success: function (res) {
                // 分享成功回调
                console.log('分享成功', res);
            },
            fail: function (res) {
                // 分享失败回调
                console.log('分享失败', res);
            }
        };
    },
    onShareTimeline(){
        // 传递的参数
        const openid= app.globalData.openid
        return {
            title:'码梦网络实用网站大全',
            query:'openid='+openid,
            success: function (res) {
                // 分享成功回调
                console.log('分享成功', res);
            },
            fail: function (res) {
                // 分享失败回调
                console.log('分享失败', res);
            }
        };
    }
  })