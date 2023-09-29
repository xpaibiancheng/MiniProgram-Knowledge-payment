// pages/user/user.js
const app=getApp({})
var timestamp=Date.parse(new Date())
var date=new Date(timestamp)
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loginFlag:0,
        userInfo:''
    },
    /* 获取手机号 */
    getPhoneNumber(res){
        // 获取openid 判断是否为老用户
        var openid=app.globalData.openid
        console.log(res);
        var _that=this
        wx.showLoading({
            title:'数据加载中'
        })
        wx.request({
          url:'https://penghonghao.songciya.cn/fanxue/phonemm',
          method:'POST',
          data:{
              action:res.detail.code
          },success:(e)=>{
              console.log(e.data.phone);
              var phoneTemp=e.data.phone
              if(e.data.status==200){
                  // 判断是否为老用户
                wx.cloud.database().collection('userinfo').where({
                    _openid:openid,
                    userPhone:phoneTemp
                }).get({
                    success:(event)=>{
                        console.log(event);
                        if(event.data.length==0){
                            // 判断是否有人邀请
                            if(wx.getStorageSync('inviteOpenid')){
                                var invite_openid = wx.getStorageSync('inviteOpenid')
                            }else{
                                var invite_openid='oVTeU65rYIqyuGJ2CIaCji9LZT-8'
                            }
                            // 新用户
                            var userTemp={}
                            userTemp.userName='微信用户'
                            userTemp.userFace='https://6d61-mamengkeji-9g3i82pg37b59653-1320854159.tcb.qcloud.la/%E7%AB%99%E5%86%85%E7%85%A7%E7%89%87/codedream.jpg?sign=16e63a838c4ad600a389efa50084a671&t=1694999398'
                            userTemp.userPhone=phoneTemp
                            userTemp.codeNum=parseInt(Math.random()*1000000)
                            userTemp.vipFlag=0
                            userTemp.loginFlag=1
                            userTemp.inviteOpenid=invite_openid
                            //上传用户数据库
                            wx.cloud.database().collection('userinfo').add({
                                data:{
                                    userName:'微信用户',
                                    userFace:'https://6d61-mamengkeji-9g3i82pg37b59653-1320854159.tcb.qcloud.la/%E7%AB%99%E5%86%85%E7%85%A7%E7%89%87/codedream.jpg?sign=16e63a838c4ad600a389efa50084a671&t=1694999398',
                                    userPhone:phoneTemp,
                                    codeNum:userTemp.codeNum,
                                    vipFlag:0,
                                    registerTime:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate())+' '+(date.getHours())+':'+(date.getMinutes())+':'+(date.getSeconds()),
                                    inviteOpenid:invite_openid
                                },
                                success(){
                                    // 存储本地
                                    wx.setStorageSync('userInfo',userTemp)
                                    wx.showToast({
                                      title: '新用户',
                                      success(){
                                            wx.hideLoading()
                                            wx.reLaunch({
                                              url: '/pages/user/user',
                                            })
                                      }
                                    })

                                }
                            })
                                
                        }else{
                            // 老用户
                            console.log(event.data);
                            var  infoTemp=event.data[0]
                            var userTemp={}
                            userTemp.userName=infoTemp.userName
                            userTemp.userFace=infoTemp.userFace
                            userTemp.userPhone=phoneTemp
                            userTemp.codeNum=infoTemp.codeNum
                            userTemp.vipFlag=infoTemp.vipFlag
                            userTemp.loginFlag=1
                            userTemp.inviteOpenid=infoTemp.invite_openid
                            wx.setStorageSync('userInfo',userTemp)
                            wx.showToast({
                                title: '老用户',
                                success(){
                                      wx.hideLoading()
                                      wx.reLaunch({
                                        url: '/pages/user/user',
                                      })
                                }
                              })

                        }
                        
                    }
                })
                 
              }else{
                  wx.showToast({
                    title: 'ERRO 500',
                  })
              }
              
          }
         
        })
    },
    // 会员中心
    bindVipCenter(){
        if(wx.getStorageSync('userInfo').vipFlag!=0){
            wx.navigateTo({
              url: '/pages/vipCenter/vipCenter',
            })
        }else{
            wx.showModal({
                title:'是否加入会员？',
                success(res){
                    if(res.confirm){
                        wx.navigateTo({
                          url: '/pages/vipBuy/vipBuy',
                        })
                    }if(res.cancel){
                        wx.showToast({
                          title: '会员权限',
                          icon:'none'
                        })
                    }
                }
            })
        }
    },
    /* 开通会员 */
    bindBuyVip(){
        // 判断是否开通会员
        if(wx.getStorageSync('userInfo').vipFlag==1){
            wx.showToast({
              title: '您已是会员',
              icon:'none'
            })
        }else{
            wx.navigateTo({
              url: '/pages/vipBuy/vipBuy',
            })
        }
    },
    /* 复制星球编号 */
    CopyBtn(res){
        var data=res.currentTarget.dataset.value.toString()
        console.log(data);
        wx.setClipboardData({
          data: data,
          success:()=>{
              wx.getClipboardData({
                  success:()=>{
                      wx.showToast({
                        title: 'Success',
                        icon:'success',
                        duration:'2000',
                        mask:"ture"//是否设置点击蒙版，防止点击穿透
                      })
                  }
              })
          },fail(e){
              console.log(e);
          }
        })
    },
    /* 修改资料 */
    bindNavToInfo(){
        console.log(wx.getStorageSync('userInfo'));
        wx.navigateTo({
          url: '/pages/login/login',
        })
    },
    /* 退出登录 */
    bindClear(){
        wx.clearStorageSync()
        wx.reLaunch({
          url: '/pages/user/user',
        })
    },
    /* 客服 */
    bindContact(){
        wx.navigateTo({
          url: '/pages/serviceCenter/serviceCenter',
        })
    },
    /* 工作室 */
    bindAboutWork(){
        wx.navigateTo({
          url: '/pages/aboutWork/aboutWork',
        })
    },
    /* 关于小程序 */
    bindMini(){
        wx.navigateTo({
          url: '/pages/aboutMini/aboutMini',
        })
    },
    /* 线上兼职 */
    bindPartTime(){
        wx.showToast({
          title: '待上线',
        })
    },
    /* GitHub开源 */
    bindGithub(){
        wx.showToast({
          title: '敬请期待',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(wx.getStorageSync('userInfo')){
            if(wx.getStorageSync('userInfo').loginFlag==1){
                this.setData({
                    loginFlag:1,
                    userInfo:wx.getStorageSync('userInfo')
                })
            }
        }
    },
    /* 转发到我的项目源码 */
    bindToCodePro(){
        wx.navigateTo({
          url: '/pages/userCodeList/userCodeList',
        })
    },
    /* 转到我的视频学习 */
    bindToVideo(){
        wx.navigateTo({
          url: '/pages/userVideoList/userVideoList',
        })
    }
})