// pages/market/market.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classNav:[
            {key:'小程序定制',value:'mini'},
            {key:'网站定制',value:'web'},
        ],
        handIndexOne:0,
        handIndexTwo:0,
        className:'跑腿/预约',
        marketRowsList:[],
        marketRows:[],
        marketRowsTemp:[]
    },
    /* 点击选择类目 */
    
    bindClickChange(res){
        console.log(res.currentTarget.dataset.index);
        var value =res.currentTarget.dataset.value
        this.setData({
            handIndexOne:res.currentTarget.dataset.index
        })
        if(value == 'mini'){
            wx.showLoading({
              title: '小程序',
            })
            wx.cloud.callFunction({
                name:'modelShow',
                data:{
                    value:'小程序'
                },
                success:(res)=>{
                    console.log('market',res);
                    var dataTemp = res.result.data
                    wx.hideLoading()
                    const valuesSet = new Set();
                    dataTemp.forEach(obj => {
                        const value = obj.kind;
                        valuesSet.add(value);
                    });
                    const resultArray = Array.from(valuesSet);
                    const modifiedResultArray = ['全部', ...resultArray];
                    console.log(modifiedResultArray);
                    this.setData({
                        marketRows:dataTemp,
                        marketRowsTemp:dataTemp,
                        marketRowsList:modifiedResultArray
                    })
                },fail:(res)=>{
                    console.log('marketErro',res);
                    wx.hideLoading()
                }
            })
        }else{
            wx.showLoading({
              title: '网站定制',
            })
            wx.cloud.callFunction({
                name:'modelShow',
                data:{
                    value:'网站定制'
                },
                success:(res)=>{
                    console.log('market',res);
                    var dataTemp = res.result.data
                    wx.hideLoading()
                    const valuesSet = new Set();
    
                    dataTemp.forEach(obj => {
                        const value = obj.kind;
                        valuesSet.add(value);
                    });
                    const resultArray = Array.from(valuesSet);
                    const modifiedResultArray = ['全部', ...resultArray];
                    console.log(modifiedResultArray);
                    this.setData({
                        marketRows:dataTemp,
                        marketRowsTemp:dataTemp,
                        marketRowsList:modifiedResultArray
                    })
    
    
                },fail:(res)=>{
                    console.log('marketErro',res);
                    wx.hideLoading()
                }
            })
        }
    },
    /* 点击选择分类 */
    bindSelectTwo(res){
        console.log(res.currentTarget.dataset.index);
        this.setData({
            handIndexTwo:res.currentTarget.dataset.index,
            className:res.currentTarget.dataset.name
        })
        var name = res.currentTarget.dataset.name
        wx.showLoading({
            title:name ,
          })
        if(name == '全部'){
            this.setData({
                marketRows:this.data.marketRowsTemp
            })
        }else{
            var temp =[]
            for(var i =0 ; i<this.data.marketRowsTemp.length;i++){
                if(this.data.marketRowsTemp[i].kind == name){
                    temp.push(this.data.marketRowsTemp[i])
                    this.setData({
                        marketRows:temp
                    })
                }
            }
        }
        wx.hideLoading()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(!wx.getStorageSync('inviteOpenid') && options.openid){
            wx.setStorageSync('inviteOpenid',options.openid)
        }
        console.log(options);
        wx.showLoading({
          title: '定制',
        })
        wx.cloud.callFunction({
            name:'modelShow',
            data:{
                value:'小程序'
            },
            success:(res)=>{
                console.log('market',res);
                var dataTemp = res.result.data
                wx.hideLoading()
                const valuesSet = new Set();

                dataTemp.forEach(obj => {
                    const value = obj.kind;
                    valuesSet.add(value);
                });
                const resultArray = Array.from(valuesSet);
                const modifiedResultArray = ['全部', ...resultArray];
                console.log(modifiedResultArray);
                this.setData({
                    marketRows:dataTemp,
                    marketRowsTemp:dataTemp,
                    marketRowsList:modifiedResultArray
                })


            },fail:(res)=>{
                console.log('marketErro',res);
                wx.hideLoading()
            }
        })
    },
    /* 转到详情页 */
    bindMarketDetail(res){
        var index = res.currentTarget.dataset.index
        var id = this.data.marketRows[index]._id
        wx.navigateTo({
          url: '/pages/marketDetail/marketDetail?id='+id,
        })
    },
    /* 分享 */
    onShareAppMessage() {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage']
        });
        // 传递的参数
        const openid = app.globalData.openid
        return {
            title:'小程序网站定制模板自选',
            path: 'pages/market/market?openid='+openid,
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
            title:'小程序网站定制模板自选',
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