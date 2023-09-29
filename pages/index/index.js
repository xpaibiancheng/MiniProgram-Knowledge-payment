const app=getApp({})
Page({
    data:{
        topNav:[
            {key:'最新文章',value:'all'},
            {key:'编程技术',value:'code'},
            {key:'IT工具',value:'tools'},
            {key:'每日技巧',value:'understanding'}
        ],
        handIndex:0,/* 点击导航栏的标志 */
        list:['https://636c-cloud1-4gsna3lu4fd8e5fb-1313325135.tcb.qcloud.la/xpblog/VIP%20(4)_proc.jpg?sign=52cdacd3f09ec61d370dbafd12142033&t=1679066636','https://636c-cloud1-4gsna3lu4fd8e5fb-1313325135.tcb.qcloud.la/xpblog/VIP%20(3)_proc.jpg?sign=9ccdb538109184d9686e3228bd42f2e3&t=1679066597','https://636c-cloud1-4gsna3lu4fd8e5fb-1313325135.tcb.qcloud.la/xpblog/VIP%20(5)_proc.jpg?sign=f795940cfe49c252bed76769bf56b3b2&t=1679066612'],
        pubList:[],//微信公众号
        codePro:[],//项目源码
        article:[],//文章排序,
        chatFlag:false

    },
    /* 导航栏来回切换 */
    bindNavTo(e){
        /* 定位点击的位置 */
        console.log(e.currentTarget.dataset.index);
        var index=e.currentTarget.dataset.index
        var value=e.currentTarget.dataset.value
        console.log(value);
        this.setData({
            handIndex:index
        })
        wx.showLoading({
            title:value
        })
        wx.cloud.callFunction({
            name:'article',
            data:{
                value:value
            },success:(res)=>{
                console.log(res);
                this.setData({
                    article:res.result.data
                })
                // 转到页面当前的位置
                wx.pageScrollTo({
                    scrollTop: 867, // 跳转到页面的垂直位置，单位为px
                    duration: 300 // 滚动动画的时长，单位为ms
                });
                wx.hideLoading()
            },fail:(res)=>{
                console.log(res);
                wx.hideLoading()
            }
        })
    },
    /* 轮播图添加作者 */
    bindToAutor(){
        wx.showModal({
        title:'添加作者',
        success(res){
            if(res.confirm){
            wx.previewImage({
                urls: ['https://636c-cloud1-4gsna3lu4fd8e5fb-1313325135.tcb.qcloud.la/xpblog/1_685906603_193_96_3_666734211_b1eecdce5eb2487c9a2d0407fdff84dd.png?sign=c37e95352f639902757017f295330ee0&t=1677217403'],
            })
            }
        }
        })
    },
    /* 关注公众号 */
    bindAttention(){
        wx.previewImage({
          urls: ['https://6d61-mamengkeji-9g3i82pg37b59653-1320854159.tcb.qcloud.la/%E7%AB%99%E5%86%85%E7%85%A7%E7%89%87/qrcode_for_gh_a0d005b4b241_344.jpg?sign=7b671bb346b1bfc2d0aea32b400cae80&t=1694762297'],
        })
    },
    /* 转到微信公众号 */
    bindGongzhongView(res){
        var index=res.currentTarget.dataset.index
        var tempUrl = this.data.pubList[index].url
        app.globalData.appWebView=tempUrl
        wx.navigateTo({
          url: '/pages/gongzhongView/gongzhongView',
        })
    },
    /* 转到项目源码 */
    bindCodeProNavTO(res){
        if(wx.getStorageSync('userInfo').loginFlag==1){
            var index=res.currentTarget.dataset.index
            const id =this.data.codePro[index]._id
            wx.navigateTo({
                url: '/pages/codeProDetail/codeProDetail?id='+id,
              })
        }else{
            wx.showToast({
              title: '请先登录',
              icon:'error',
              success(){
                  wx.switchTab({
                    url: '/pages/user/user',
                  })
              }
            })
        }
    },
    /* chatGPT */
    bindNavToAi(){
        var that = this
        wx.cloud.database().collection('title').get({
            success(res){
                console.log(res);
                if(res.data[0].flag==1){
                    wx.navigateTo({
                      url: '/pages/chatAi/chatAi',
                    })
                    
                }else{
                    wx.showToast({
                      title: '已下架~',
                    })
                }
            }
        })
    },
    /* 查看文章 */
    bindIndex(res){
        var index=res.currentTarget.dataset.index
        console.log(index);
        var id = this.data.article[index]._id
        /* app.globalData.appWebView=tempUrl */
        wx.navigateTo({
          url: '/pages/gongzhongView/gongzhongView?id='+id,
        })
        
    },
    /*  */
    onLoad(options){
        wx.showLoading({
            title:"加载中...."
        })
        console.log(wx.getStorageSync('inviteOpenid'));
         // 将options.openid存储在本地   
        //判断是否已经在库里
        if(!wx.getStorageSync('inviteOpenid') && options.openid){
            wx.setStorageSync('inviteOpenid',options.openid)
        }if(!wx.getStorageSync('inviteOpenid') && !options.openid){
            wx.setStorageSync('inviteOpenid', 'oVTeU65rYIqyuGJ2CIaCji9LZT-8')
            console.log('没有任何参数：',wx.getStorageSync('inviteOpenid'));
        }
        console.log('index页面options',options);
        // 公众号
        wx.cloud.database().collection('weChatOffcial').get({
            success:(pubRes)=>{
                console.log('公众号数据：',pubRes);
                this.setData({
                    pubList:pubRes.data
                })
               
            }
        })
        // 精品项目源码
        wx.cloud.database().collection('codePro').where({
            status:true
        }).get({
            success:(res)=>{
                console.log('项目源码',res);
                this.setData({
                    codePro:res.data
                })
               

            }
        })
        // 最新文章
        wx.cloud.database().collection('article').orderBy('subTime','desc').get({
            success:(res)=>{
                this.setData({
                    article:res.data
                })
                wx.hideLoading()
            }
        })
        //轮播图
        wx.cloud.database().collection('swiperIndex').get({
            success:(res)=>{
                console.log('轮播图',res);
                this.setData({
                    list:res.data[0].swiperImgs
                })
            }
        })
    },
    bindMore(){
        wx.navigateTo({
          url: '/pages/articleMore/articleMore',
        })
    },
    /* 转到项目源码 */
    bindCode(){
        wx.switchTab({
          url: '/pages/code/code',
        })
    },
    /* 编程工具箱 */
    bindtool(){
        wx.navigateTo({
          url: '/pages/codeTool/codeTool',
        })
    },
    /* 喜迎国庆 */
    bindTapGuuoqing(){
        wx.navigateTo({
          url: '/pages/userPhoto/userPhoto',
        })
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
        const openid= app.globalData.openid
        return {
            title:'码梦编程星球技术学习',
            path: 'pages/index/index?openid='+openid,
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
            title:'码梦编程星球技术学习',
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