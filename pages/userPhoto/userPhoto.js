// pages/userPhoto/userPhoto.js
//获取应用实例
const app = getApp()
import { Router } from '../../utils/router.js'
//获取画布
const ctx = wx.createCanvasContext('getImg')
Router({
  //绘图
  // 绘图
    drawImg(headImg, index) {
    let that = this
    wx.showLoading({
      title: '图片生成中...',
    })
  
    let promiseFrame = new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: that.data.photo_bj_num[index],
        success(res) {
          resolve(res)
        },
        fail(e) {
          reject("调用失败");
        }
      })
    })
  
    Promise.all([promiseFrame]).then(res => {
      let num = 1024
      let ctx = wx.createCanvasContext('getImg') // 创建画布上下文对象
      ctx.drawImage(headImg, 0, 0, num, num) // 绘制本地图片
      ctx.drawImage(res[0].path, 0, 0, num, num) // 绘制网络图片
      ctx.draw(false, setTimeout(function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: num,
          height: num,
          destWidth: num,
          destHeight: num,
          canvasId: 'getImg',
          success(res) {
            that.setData({
              new_userImage: res.tempFilePath,
              new_showuserImage: true,
              userImage: headImg
            })
            wx.hideLoading()
          },
          fail(res) {
            console.log("绘图错误：" + res);
            wx.hideLoading()
          }
        }, that);
      }, 100))
    }).catch(e => console.log(e));
    },
  /**
   * 页面的初始数据
   */
  data: {
    isiPhoneX: false,
    userImage: '',
    new_userImage: '',
    new_showuserImage: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    photo_bj_num: ['https://6d61-mamengkeji-9g3i82pg37b59653-1320854159.tcb.qcloud.la/%E7%AB%99%E5%86%85%E7%85%A7%E7%89%87/ah8.png?sign=d9d404e6b7b85cbe7a1f20f107814ee3&t=1695885715'],
    photo_select_idx:0,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        if(!wx.getStorageSync('inviteOpenid') && options.openid){
            wx.setStorageSync('inviteOpenid',options.openid)
        }
        console.log('code页面',options);
        wx.showLoading({
            title: '资源加载中',
        })
        wx.cloud.database().collection('guoqingIcon').get({
            success:(res)=>{
                    console.log(res);
                    this.setData({
                        photo_bj_num:res.data[0].imges
                    })
                    wx.hideLoading()
            }
        })
        
  },
  /**
   * 用户点击获取图片
   */
  tapSelectUserClick: function () {
    let self = this;
    console.log('点击获取图片');
    wx.showActionSheet({
      itemList: ["从手机相册选择"],
      success(e) {
        console.log(e)
        console.log('success');
        if (!e.camcle) {
          if (e.tapIndex == 0) {
            /* self.getUSerWechatInfo_Photo(); */
            self.getUSerMobile_Photo();
          } else if (e.tapIndex == 1) {
            
          }
        } else {
          console.log("cancle");
        }
      },
      fail(e) {
        console.log("fail: --- ", e);
      },
      complete(e) {
        console.log("complete --- ", e);
      }
    })
  },
  onChooseAvatar(e){
    /* const {avatarUrl}=e.detail */
    console.log(e.detail.avatarUrl);
    var that = this
    that.drawImg(e.detail.avatarUrl,that.data.photo_select_idx)
    that.setData({
        hasUserInfo: true
    })
  },
 /**
  * 下载用户微信头像
  */
    setUserWeCahtPhoto: function(url) {
    let that = this
    wx.downloadFile({
        url: that.headimgHD(url),
        success: function (res) {
        if (res.statusCode === 200) {
            that.drawImg(res.tempFilePath, that.data.photo_select_idx);
        }
        }
    })
    },

  /**
  * 获取用户微信头像
  */
  getUSerWechatInfo_Photo: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
      this.setUserWeCahtPhoto(app.globalData.userInfo.avatarUrl);

    } else {
      let that = this
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          that.setUserWeCahtPhoto(app.globalData.userInfo.avatarUrl);
        }
      })
    }
  },
  /**
  * 打开用户相册
  */
  getUSerMobile_Photo: function () {
    let that = this
    // let index = e.currentTarget.dataset.index
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let tempFilePath = res.tempFilePaths[0];
        console.log(tempFilePath);
        that.drawImg(tempFilePath, that.data.photo_select_idx)
        that.setData({
          hasUserInfo: true
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })

  },
  /**
  * 重置画布
  */
  editClick: function () {
    this.setData({
      hasUserInfo: false,
      userImage : '',
      new_userImage : '',
      new_showuserImage: false
    })
  },
  /**
  * 获取高清微信头像
  */
 headimgHD : function (imageUrl) {       
    console.log('原来的头像', imageUrl);
    imageUrl = imageUrl.split('/'); 
    if (imageUrl[imageUrl.length - 1] && 
      (imageUrl[imageUrl.length - 1] == 46 || imageUrl[imageUrl.length - 1] == 64 || imageUrl[imageUrl.length - 1] == 96 || imageUrl[imageUrl.length - 1] == 132)) {
            imageUrl[imageUrl.length - 1] = 0;
      }
        imageUrl = imageUrl.join('/');  
        console.log('高清的头像', imageUrl);        
        return imageUrl;
    },


  saveloadFile: function () {
    if(!this.data.new_userImage){
      wx.showModal({
        content: '没有图片可保存~',
        showCancel: false,
        confirmText: '明白了',
      })
      return
    }

    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.new_userImage,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册了~',
          showCancel: false,
          confirmText: '没毛病',
          success(res) {
            if (res.confirm) {
              log("点击确定,老铁没毛病")
            }
          }
        })
      }
    })
  },

  bigimg: function (e) {

    if(this.data.userImage){
      this.setData({
        photo_select_idx : e.currentTarget.dataset.item
      });
      this.drawImg(this.data.userImage,this.data.photo_select_idx);
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
        const openid= app.globalData.openid
        return {
            title:'喜迎中秋，欢度国庆，国庆头像一键制作 ',
            path: 'pages/userPhoto/userPhoto?openid='+openid,
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
            title:'喜迎中秋，欢度国庆，国庆头像一键制作' ,
            query: 'openid='+openid,
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