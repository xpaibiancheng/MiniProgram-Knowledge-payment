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
        wx.cloud.database().collection('modelShow').doc(id).get({
            success:(res)=>{
                this.setData({
                    detailRow:res.data  
                })
                wx.hideLoading()
            }
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
        const id=this.data.detailRow._id
        const openid= app.globalData.openid
        const title=this.data.detailRow.title
        return {
            title:title ,
            path: 'pages/marketDetail/marketDetail?id='+id+'&'+'openid='+openid,
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