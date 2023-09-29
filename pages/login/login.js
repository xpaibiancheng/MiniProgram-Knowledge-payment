// pages/login/login.js
const defaultAvatarUrl = 'https://636c-cloud01-5gci5yp03a100130-1317739072.tcb.qcloud.la/bg/ava.png?sign=6156aab32b6bad6a040cbbeb834770e0&t=1681138034'
const db=wx.cloud.database()
var timestamp=Date.parse(new Date())
var date=new Date(timestamp)
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:defaultAvatarUrl,
    inviteCode:'',
    nickname:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  /* 自定义头像 */
  onChooseAvatar(e){
    const {avatarUrl}=e.detail
    this.setData({
      avatarUrl,
    })
    this.upLoadImages() 
  },
  /* 将头像上传 */
  upLoadImages(){
     var that=this
     wx.showLoading({
       title:'头像上传云端中'
     })
       wx.cloud.uploadFile({
        cloudPath:`userimage/${Math.random()}_${Date.now()}.${that.data.avatarUrl.match(/\.(\w+)$/)[1]}`,
         filePath: that.data.avatarUrl,
         success(res){
           console.log(res);
           wx.cloud.getTempFileURL({
              fileList:[res.fileID],
              success(e){
                wx.hideLoading()
                console.log(e.fileList[0].tempFileURL);
                that.setData({
                  avatarUrl:e.fileList[0].tempFileURL
                })
              }
           })
         }
       })
  },
  /* 名称 */
  bindNickname(e){
    console.log(e.detail.value);
    this.setData({
      nickname:e.detail.value
    })
  },
  /* 提交 */
  bindSubmit(){
      var that=this
    wx.showLoading({
        title:'修改中'
    })
    if(that.data.nickname.length>0 && that.data.avatarUrl!=defaultAvatarUrl){
        db.collection('userinfo').where({
            _openid:app.globalData.openid
        }).update({
            data:{
                userName:this.data.nickname,
                userFace:this.data.avatarUrl
            },success:()=>{
                var temp=wx.getStorageSync('userInfo')
                temp.userName=this.data.nickname
                temp.userFace=this.data.avatarUrl
                wx.setStorageSync('userInfo', temp)
                wx.showToast({
                  title: 'Success！',
                  success(){
                      wx.reLaunch({
                        url: '/pages/user/user',
                      })
                  }
                })
            }
        })
        
    }else{
        wx.showToast({
          title: '信息完整',
          icon:'none',
          duration:'2000'
        })
    }
  },
  onLoad(options) {
    
    
  
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