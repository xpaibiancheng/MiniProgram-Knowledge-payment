// pages/veido/veido.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        handIndex:0,
        videoStudyRows:[],
        videoStudyTemp:[],
        videoStudyList:[]
    },
    bindHandIndex(res){
        console.log(res.currentTarget.dataset.index);
        console.log(res.currentTarget.dataset.name);
        this.setData({
            handIndex:res.currentTarget.dataset.index
        })
        var value = res.currentTarget.dataset.value
        wx.showLoading({
            title:value
        })
        if(value=='全部'){
            this.setData({
                videoStudyRows:this.data.videoStudyTemp
            })
        }else{
            const rows = this.data.videoStudyTemp
            const rowsTemp = []
            for(var i =0 ;i<rows.length;i++){
                if(value==rows[i].class){
                    rowsTemp.push(rows[i])
                    this.setData({
                        videoStudyRows:rowsTemp,
                    })
                }
            }
        }
        wx.hideLoading()
    },

    /**
     * 生命周期函数--监听页面加载m
     */
    onLoad(options) {
        if(!wx.getStorageSync('inviteOpenid') && options.openid){
            wx.setStorageSync('inviteOpenid',options.openid)
        }
        console.log('vedio',options.openid);
        console.log(options);
        wx.showLoading({
            title:'学习资源'
        })
        wx.cloud.callFunction({
            name:'videoStudy',
            data:{
                value:'all'
            },success:(res)=>{
                console.log('视频学习',res.result.data);
                // 分出大类
                var dataTemp= res.result.data
                //筛选出项目类
                const valuesSet = new Set();
                dataTemp.forEach(obj => {
                    const value = obj.class;
                    valuesSet.add(value);
                });
                const resultArray = Array.from(valuesSet);
                const modifiedResultArray = ['全部', ...resultArray];
                console.log(modifiedResultArray);
                this.setData({
                    videoStudyRows:res.result.data,
                    videoStudyTemp:res.result.data,
                    videoStudyList:modifiedResultArray
                })
                wx.hideLoading()
            },fail:(res)=>{
                console.log(res);
                wx.hideLoading()
                wx.showToast({
                  title: '前往小程序查看资源',
                  icon:'error'
                })
            }
        })
    },
    //详细内容
    navToCodeProDetail(res){
        var index=res.currentTarget.dataset.index
        const idTemp=this.data.videoStudyRows[index]._id
        wx.navigateTo({
            url: '/pages/videoDetail/videoDetail?id='+idTemp,
        })
        
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

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
            path: 'pages/veido/veido?openid='+openid,
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