// pages/userCodeList/userCodeList.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailRow:[],
        resourceFlag:false,
        collectData:[]
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
          title: '加载中',
        })
        wx.cloud.callFunction({
            name:'userCodeList',
            data:{
                dist:'videoProLists',
                value:app.globalData.openid
            },success:(res)=>{
                console.log(res);
                this.setData({
                    detailRow:res.result.data
                })
                wx.hideLoading()
            },fail:(res)=>{
                console.log(res);
                wx.hideLoading()
            }
        })
    },
    /* 查看资源 */
    bindFoundRe(res){
        var index=res.currentTarget.dataset.index
        var id = this.data.detailRow[index].pre_id
        wx.showLoading({
          title: '查看中',
        })
        wx.cloud.database().collection('studyVideo').where({
            _id:id
        }).get({
            success:(e)=>{
                console.log(e);
                this.setData({
                    collectData:e.data[0],
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
                wx.hideLoading()
            },fail:(e)=>{
                console.log(e);
            }
        })
    },
    /* 关闭 */
    bindClose(){
        this.setData({
            resourceFlag:false
        })
    },
    /* 保存方式二图片 */
    bindPreviewTwo(res){
        var url=res.currentTarget.dataset.url
        wx.previewImage({
            urls: [url],
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
   }
})