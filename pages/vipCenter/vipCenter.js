// pages/vipCenter/vipCenter.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        gridData: [
            { icon: '/static/生成图片.png', text: '生成推广码' },
            { icon: '/static/群组.png', text: '加入学习群' },
            { icon: '', text: '' },
            { icon: '', text: '' },
            { icon: '', text: '' },
            { icon: '', text: '' },
            { icon: '', text: '' },
            { icon: '', text: '' },
            { icon: '', text: '' },
          ],
          jixiao:{key:0,value:0},
          moneySum:0
    },
    // 推销
    bindTapNow(res){
        var index=res.currentTarget.dataset.index
        console.log(index);
        index=parseInt(index)
        if(index==0){
            wx.previewImage({
              urls: ['https://6d61-mamengkeji-9g3i82pg37b59653-1320854159.tcb.qcloud.la/userimage/%E6%95%99%E4%BD%A0%E7%8E%A9%E8%BD%AC.png?sign=532c484fa56ffb73915f7d9fc851719e&t=1695219390'],
            })
        }if(index==1){
            wx.previewImage({
              urls: ['https://6d61-mamengkeji-9g3i82pg37b59653-1320854159.tcb.qcloud.la/userimage/%E6%95%99%E4%BD%A0%E7%8E%A9%E8%BD%AC%20(1).png?sign=ab41b56480eb270767a77111eab7d199&t=1695219407'],
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
          title: '加载中',
        })
        //绩效数
        wx.cloud.database().collection('userinfo').where({
            _openid:app.globalData.openid
        }).get({
            success:(res)=>{
                console.log("绩效数:",res.data[0].shareMoney);
                var numTemp=parseFloat(res.data[0].shareMoney)
                var valueTemp=(numTemp*100).toFixed(2)
                this.setData({
                    jixiao:{
                        key:numTemp,
                        value:valueTemp
                    }
                })
                // 计算收益
                wx.cloud.database().collection('orderStatus').where({
                    invite_openid:app.globalData.openid
                }).get({
                    success:(res)=>{
                        console.log('计算收益:',res.data);
                        var temp=res.data
                        var sum=0
                        for(var i=0;i<temp.length;i++){
                            sum=sum+(temp[i].pre_price*numTemp)
                            this.setData({
                                moneySum:sum.toFixed(2)
                            })
                        }
                        
                    }
                })
                    }
                })
        //推广数量
        wx.cloud.database().collection('userinfo').where({
            inviteOpenid:app.globalData.openid
        }).get({
            success:(res)=>{
                console.log("推广数:",res.data.length);
                this.setData({
                    num:res.data.length
                })
                wx.hideLoading()
            }
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

    }
})