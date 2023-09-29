// pages/chatai/chatai.js
const app=getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    text:'',
    talkObj:[],
    copyValue:[],
    what_detail:'我是ChatGPT，一个由OpenAl训l练的大型语言模型。我可以帮助你理解世界上发生的事情，提供有价值的建议，也可以帮助你找到灵感来解决问题。我拥有无限的知识，可以深入解释这个时代的趋势和观点，从而帮助你认识这个时代，并更好地成长和学习。（来自ChatGPT回复）',
  },
  /* example */
  bindExample(res){
    console.log(res.currentTarget.dataset.name);
    this.setData({
      text:res.currentTarget.dataset.name
    })
  },
  /* 获取内容 */
  bindValue(res){
    /* console.log(res.detail.value); */
    this.setData({
      text:res.detail.value
    })
  },
  /* 清除对话 */
  bindClear(){
    this.setData({
      talkObj:[],
      copyValue:[]
    })
  },
  /* 发送 */
  bindButton(){
    var that=this
    var action={}
    action.role="user"
    action.content=that.data.text
    console.log(action);
    /* wx.showLoading({
      title: '请求中',
    }) */
    wx.showLoading({
      title: '思考中',
    })
    wx.request({
        url: 'https://penghonghao.songciya.cn/miniChat',
        method:'POST',
        /* timeout:30000, */
        data:action,
       success:function(res){
            console.log(res);
            var copy=that.data.copyValue
            copy.push(res.data)
            that.setData({
             copyValue:copy
            })
            let result = app.towxml(res.data,'markdown')
            wx.hideLoading()
            var temp={}
            var item=that.data.talkObj
            temp.user=that.data.text
            temp.article=result
            item.push(temp)
            that.setData({
            talkObj:item,
            text:''
            })
            console.log(item);
            wx.hideLoading()
          
        },fail(res){
          wx.hideLoading()
          wx.showToast({
            title: '链接超时',
            icon: 'none'
          })
          console.log('失败',res);
        }
      })
    
    
  
  },
  /* 复制 */
  bindCopy(res){
    var that=this
    console.log(res.currentTarget.dataset.value);
    wx.setClipboardData({//复制文本
        data:that.data.copyValue[res.currentTarget.dataset.value],
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(!wx.getStorageSync('inviteOpenid') && options.openid){
        wx.setStorageSync('inviteOpenid',options.openid)
    }
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