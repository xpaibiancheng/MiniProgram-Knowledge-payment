// pages/gongzhongView/gongzhongView.js
const app =getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url:'',
        title:'码梦编程星球技术学习'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //是否有人邀请
        if(!wx.getStorageSync('inviteOpenid') && options.openid){
            wx.setStorageSync('inviteOpenid',options.openid)
        }
        console.log(options);
        wx.showLoading({
            title:'加载'
        })
        var id =options.id
        wx.cloud.database().collection('article').doc(id).get({
            success:(res)=>{
                console.log(res);
                this.setData({
                    id:res.data._id,
                    url:res.data.url,
                    title:res.data.title
                })
                wx.hideLoading()
            }
        })
        
        
    },

    onShareAppMessage() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage']
        });
        // 传递的参数
        const id = this.data.id
        const openid= app.globalData.openid
        return {
            title:this.data.title,
            path:'pages/gongzhongView/gongzhongView?id='+id+'&'+'openid='+openid,
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
    onShareTimeline:function(){
        // 传递的参数
        const id = this.data.id
        const openid= app.globalData.openid
        return {
            title:this.data.title,
            query:'id='+id+'&'+'openid='+openid,
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