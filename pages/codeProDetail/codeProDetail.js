// pages/codeProDetail/codeProDetail.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        richText:[],
        detailRow:{},
        vipFlag:0,
        resourceFlag:false,
        payStyle:'',
        payStyleFlag:false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log('传参',options);
        console.log('本地缓存:',wx.getStorageSync('userInfo'));
        // 将options.openid存储在本地   
                //判断是否已经在库里
        if(!wx.getStorageSync('inviteOpenid') && options.openid){
            wx.setStorageSync('inviteOpenid',options.openid)
        }
        console.log(wx.getStorageSync('inviteOpenid'));
        // 判断是否登录
        this.setData({
            vipFlag:wx.getStorageSync('userInfo').vipFlag
        })
        const id=options.id
        wx.showLoading({
            title:'加载中'
        })
        wx.cloud.database().collection('codePro').doc(id).get({
            success:(res)=>{
                this.setData({
                    detailRow:res.data  
                })
                wx.hideLoading()
            }
        })
    },
    /* 立即购买 */
    bindBuy(){
        if(wx.getStorageSync('userInfo').loginFlag==1){
            if(this.data.detailRow.price==0){
                this.setData({
                    resourceFlag:true
                })
                // 创建渐隐动画对象
                var animation = wx.createAnimation({
                    duration: 300,
                    timingFunction: 'ease-out'
                    });
                    animation.opacity(0).step();
                    this.setData({
                        animationData: animation.export()
                    });
    
                // 创建渐显动画对象
                setTimeout(() => {
                    var animation = wx.createAnimation({
                    duration: 300,
                    timingFunction: 'ease-in'
                    });
                    animation.opacity(1).step();
                    this.setData({
                    animationData: animation.export()
                    });
                }, 300);
            }else{
                this.setData({
                    payStyleFlag:!this.data.payStyleFlag
                })
            }
        }else{
           wx.showModal({
               title:'您似乎还没登录',
               content:'确定现在登录？',
               success:(events)=>{
                   if(events.confirm){
                       wx.switchTab({
                         url: '/pages/user/user',
                       })
                   }if(events.cancel){

                   }
               }

           })
        }
        
    },
    /* 付款方式传参 */
    radioChange(res){
        this.setData({
            payStyle:res.detail.value
        })
    },
    /* 选择付款方式 */
    bindSubPay(){
        if(this.data.payStyle=='vip'){
            wx.navigateTo({
              url: '/pages/vipBuy/vipBuy',
            })
        }if(this.data.payStyle=='payNow'){
                    wx.showLoading({
                        title:'创建订单中'
                    })
                    var _this=this
                    var that =this
                    const timestamp = Date.now().toString(); // 获取当前时间戳
                    const randomStr = Math.random().toString(36).substr(2, 8); // 生成8位随机字符串
                    const orderNumber = timestamp + randomStr; // 组合订单号
                    const invite_openid=wx.getStorageSync('inviteOpenid') // 邀请码
                    wx.cloud.database().collection('orderStatus').add({
                        data:{
                            pre_title:that.data.detailRow.title,
                            pre_id:that.data.detailRow._id,
                            pre_price:that.data.detailRow.price,
                            pay_status:'wait',
                            order_number:orderNumber,
                            create_time:new Date().getTime(),
                            invite_openid:invite_openid
                        },success(event){
                            wx.cloud.callFunction({
                                name:'payPre',
                                data:{
                                    pro_name:that.data.detailRow.title,
                                    pro_codeNum:orderNumber,
                                    pro_price:that.data.detailRow.price*100,
                                },
                                success(res_2){
                                    console.log(res_2);
                                    wx.hideLoading()
                                    wx.requestPayment({
                                        timeStamp: res_2.result.payment.timeStamp,
                                        nonceStr: res_2.result.payment.nonceStr,
                                        package: res_2.result.payment.package,
                                        signType: 'MD5',
                                        paySign: res_2.result.payment.paySign,
                                        success (res_3) {
                                                wx.showToast({
                                                    title: '支付成功',
                                                    icon:'success',
                                                    duration:2000
                                                })
                                                _this.setData({
                                                    resourceFlag:true,
                                                    payStyleFlag:false
                                                })
                                                // 创建渐隐动画对象
                                                var animation = wx.createAnimation({
                                                    duration: 300,
                                                    timingFunction: 'ease-out'
                                                    });
                                                    animation.opacity(0).step();
                                                    _this.setData({
                                                        animationData: animation.export()
                                                    });
                                        
                                                // 创建渐显动画对象
                                                setTimeout(() => {
                                                    var animation = wx.createAnimation({
                                                    duration: 300,
                                                    timingFunction: 'ease-in'
                                                    });
                                                    animation.opacity(1).step();
                                                    _this.setData({
                                                    animationData: animation.export()
                                                    });
                                                }, 300);
                                            },
                                        fail (res_3) {
                                                console.log('支付失败');
                                            }
                                        })
                                },fail(res_2){
                                    console.log(res_2);
                                }
                            })
                        }
                    })
        }else{
            wx.showToast({
            title: '选择付款方式',
            icon:'error'
            })
        }
    
    },
    /* 加入学习计划 */
    bindaddPlan(){
        var that = this
        wx.showLoading({
          title: '检验中',
        })
        // 检测是否为会员
        if(wx.getStorageSync('userInfo').vipFlag != 1){
            // c查询订单是否存在
            wx.cloud.database().collection('orderStatus').where({
                _openid:app.globalData.openid,
                pre_id:that.data.detailRow._id,
                pay_status:'订单完成'
            }).get({
                success:(res)=>{
                    wx.hideLoading()
                    console.log(res);
                    if(res.data.length>0){
                        var tempOrder = res.data[0]
                        wx.showLoading({
                          title: '加入中',
                        })
                        wx.cloud.database().collection('codeProLists').add({
                            data:{
                                pre_id:that.data.detailRow._id,
                                pay_status:tempOrder.pay_status,
                                pay_name:tempOrder.pre_title,
                                pay_price:tempOrder.pre_price
                            },success:()=>{
                                wx.showToast({
                                  title: '加入成功！',
                                })
                                wx.hideLoading()
                            },fail:(events)=>{
                                console.log(events);
                                wx.showToast({
                                  title: 'Erro',
                                  icon:'error'
                                })
                                wx.hideLoading()
                            }
                        })    
                    }if(res.data.length==0){
                        // 是否为免费资源
                        if(that.data.detailRow.price==0){
                            wx.showLoading({
                              title: '加入中',
                            })
                            wx.cloud.database().collection('codeProLists').add({
                                data:{
                                    pre_id:that.data.detailRow._id,
                                    pay_status:'免费资源',
                                    pay_name:that.data.detailRow.title,
                                    pay_price:that.data.detailRow.price
                                },success:()=>{
                                    wx.showToast({
                                      title: '加入成功！',
                                    })
                                    wx.hideLoading()
                                },fail:(events)=>{
                                    console.log(events);
                                    wx.showToast({
                                      title: 'Erro',
                                      icon:'error'
                                    })
                                    wx.hideLoading()
                                }
                            })
                        }else{
                            wx.showModal({
                                title: '您似乎没有加入星球会员或购买该资源',
                                content: '是否加入星球会员或购买？',
                                complete: (res) => {
                                  if (res.cancel) {
                                    
                                  }
                                  if (res.confirm) {
                                     that.setData({
                                         payStyleFlag:true
                                     })
                                     // 创建渐隐动画对象
                                    var animation = wx.createAnimation({
                                        duration: 300,
                                        timingFunction: 'ease-out'
                                        });
                                        animation.opacity(0).step();
                                        that.setData({
                                            animationData: animation.export()
                                        });
                        
                                    // 创建渐显动画对象
                                    setTimeout(() => {
                                        var animation = wx.createAnimation({
                                        duration: 300,
                                        timingFunction: 'ease-in'
                                        });
                                        animation.opacity(1).step();
                                        that.setData({
                                        animationData: animation.export()
                                        });
                                    }, 300);
                                  }
                                }
                            })
                        }
                    }
                }
            })
            /* */
        }if(wx.getStorageSync('userInfo').vipFlag == 1){
            wx.showLoading({
                title:"加入中"
            })
            wx.cloud.database().collection('codeProLists').add({
                data:{
                    pre_id:that.data.detailRow._id,
                    pay_status:'会员免费得',
                    pay_name:that.data.detailRow.title,
                    pay_price:that.data.detailRow.price
                },success:()=>{
                    wx.showToast({
                      title: '加入成功！',
                    })
                    wx.hideLoading()
                },fail(){
                    wx.showToast({
                      title: 'Erro',
                      icon:'error'
                    })
                    wx.hideLoading()
                }
            }) 
        }
    },
    /*  */
    /* 关闭付款方式按钮 */
    bindClosePay(){
        this.setData({
            payStyleFlag:false
        })
    },
    /* 会员下载资源 */
    bindGetResource(){
        this.setData({
            resourceFlag:!this.data.resourceFlag
        })
        // 创建渐隐动画对象
        var animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease-out'
            });
            animation.opacity(0).step();
            this.setData({
                animationData: animation.export()
            });
  
        // 创建渐显动画对象
        setTimeout(() => {
            var animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease-in'
            });
            animation.opacity(1).step();
            this.setData({
            animationData: animation.export()
            });
        }, 300);
    },
    /* 关闭敞口 */
    bindClose(){
        this.setData({
            resourceFlag:false
        })
    },
    /* 复制内容 */
    bindCopyResource(res){
        var data=res.currentTarget.dataset.url
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
    /*分享 */
    bindShare(){
        wx.showModal({
          title: '点击右上角...转发',
          content: '通过您转发来星球的用户，在星球所有的消费都按照您的佣金绩效提现，具体点击我的会员中心查看',
          complete: (res) => {
            if (res.cancel) {

            }
            if (res.confirm) {
              
            }
          }
        })
    },
    /* 联系客服 */
     /* 接入客服 */
     methods: {
        handleContact(e) {
          console.log(e.detail.path)
          console.log(e.detail.query)
        }
    },
    /* 邀请人机制  */
    bindShareNoMoney(){
        // 先判断登录
        if(wx.getStorageSync('userInfo').loginFlag==1){
            const num=this.data.detailRow.shareNum
            wx.showModal({
                title: '点击右上角...分享',
                content: '邀请'+num+'位微信好友加入星球获得资源（必须登录）,点确定查看邀请进度',
                complete: (res) => {
                if (res.cancel) {
                        
                }
                if (res.confirm) {
                        wx.showLoading({
                            title:'确认中'
                        })
                        wx.cloud.database().collection('userinfo').where({
                            inviteOpenid:app.globalData.openid
                        }).get({
                            success:(res)=>{
                                wx.hideLoading()
                                if(res.data.length>=num){

                                    this.setData({
                                        resourceFlag:1
                                    })
                                    // 创建渐隐动画对象
                                    var animation = wx.createAnimation({
                                        duration: 300,
                                        timingFunction: 'ease-out'
                                        });
                                        animation.opacity(0).step();
                                        this.setData({
                                            animationData: animation.export()
                                        });
                            
                                    // 创建渐显动画对象
                                    setTimeout(() => {
                                        var animation = wx.createAnimation({
                                        duration: 300,
                                        timingFunction: 'ease-in'
                                        });
                                        animation.opacity(1).step();
                                        this.setData({
                                        animationData: animation.export()
                                        });
                                    }, 300);
                                }else{
                                    wx.showToast({
                                    title: '已邀'+res.data.length+'人',
                                    })
                                }
                            }
                        })
                }
                }
            })    
        }else{
            wx.showModal({
                title:'您似乎还没登录',
                content:'确定现在登录？',
                success:(events)=>{
                    if(events.confirm){
                        wx.switchTab({
                          url: '/pages/user/user',
                        })
                    }if(events.cancel){
 
                    }
                }
 
            })
        
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage']
        });
        // 传递的参数
        const id=this.data.detailRow._id
        const openid= app.globalData.openid
        const title=this.data.detailRow.title
        return {
            title:title ,
            path: 'pages/codeProDetail/codeProDetail?id='+id+'&'+'openid='+openid,
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
        const id=this.data.detailRow._id
        const openid= app.globalData.openid
        const title=this.data.detailRow.title
        return {
            title:title ,
            query: 'id='+id+'&'+'openid='+openid,
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