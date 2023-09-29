// pages/vipBuy/vipBuy.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        vipInfo:[]
    },
    // 支付会员
    bindPayVip(res){
        // 会员索引
        var index=res.currentTarget.dataset.index
        // 会员对应信息
        var payInfo=this.data.vipInfo[index]
        wx.showModal({
            title:"开通"+payInfo.vipName+"?",
            success:(e)=>{
                if(e.confirm){
                    wx.showLoading({
                        title:'订单创建中'
                    })
                    //创建订单
                    const timestamp = Date.now().toString(); // 获取当前时间戳
                    const randomStr = Math.random().toString(36).substr(2, 8); // 生成8位随机字符串
                    const orderNumber = timestamp + randomStr; // 组合订单号
                   // 邀请码
                    const invite_openid=wx.getStorageSync('inviteOpenid')
                    wx.cloud.database().collection('orderStatus').add({
                        data:{
                            pre_title:payInfo.vipName,
                            pre_id:payInfo._id,
                            pre_price:payInfo.price,
                            pay_status:'wait',
                            order_number:orderNumber,
                            create_time:new Date().getTime(),
                            invite_openid:invite_openid
                        },success(res_2){
                            // 订单处理
                            wx.cloud.callFunction({
                                name:'payPre',
                                data:{
                                    pro_name:payInfo.vipName,
                                    pro_codeNum:orderNumber,
                                    pro_price:payInfo.price*100,
                                },
                                success(res_3){
                                    console.log(res_3);
                                    wx.hideLoading()
                                    // 调起支付
                                    wx.requestPayment({
                                        timeStamp: res_3.result.payment.timeStamp,
                                        nonceStr: res_3.result.payment.nonceStr,
                                        package: res_3.result.payment.package,
                                        signType: 'MD5',
                                        paySign: res_3.result.payment.paySign,
                                        success (res_4) {
                                            // 有效期
                                            var dateUpTemp=parseInt(payInfo.days) 
                                            //会员到期日期
                                            const currentDate = new Date();
                                            const expirationDate = new Date(currentDate.getTime() + (dateUpTemp * 24 * 60 * 60 * 1000)); // 计算有效期到期的日期
                                            console.log("会员到期时间：",expirationDate);
                                            // 重构 会员标志
                                           wx.cloud.database().collection('userinfo').where({
                                               _openid:app.globalData.openid
                                           }).update({
                                               data:{
                                                   vipFlag:1,
                                                   shareMoney:payInfo.makeMoney,
                                                   dueDate:expirationDate
                                               },success(){
                                                    var tempVip = wx.getStorageSync('userInfo')
                                                    tempVip.vipFlag=1
                                                    tempVip.shareMoney=payInfo.makeMoney
                                                    tempVip.dueDate=expirationDate
                                                    wx.setStorageSync('userInfo', tempVip)
                                                    wx.showToast({
                                                        title: '支付成功',
                                                        icon:'success',
                                                        duration:2000,
                                                        success(){
                                                            wx.reLaunch({
                                                                url: '/pages/user/user',
                                                            })
                                                        }
                                                    })
                                                    console.log('支付成功');
                                               }
                                           })
                                           
                                         },
                                        fail (res_4) {
                                            console.log('支付失败');
                                         }
                                      })
                                },fail(res_3){
                                    console.log('失败：',res_3);
                                }
                            })
                        },fail(res_2){
                            console.log("失败：",res_2);
                        }
                    })
                }if(e.cancel){
                    wx.showToast({
                      title: '开通取消',
                      icon:'error'
                    })
                }
            }
        })
    },  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log('本地地址:',wx.getStorageSync('userInfo'));
        // 会员信息w
        wx.showLoading({
            title:'获取中....'
        })
        wx.cloud.database().collection('vipInfo').get({
            success:(res)=>{
                this.setData({
                    vipInfo:res.data
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