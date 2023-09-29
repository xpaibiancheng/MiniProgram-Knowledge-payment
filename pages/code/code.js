// pages/code/code.js
const app=getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        codeProLists:[],
        filterTwo:[
            {key:'全部',value:'all'},
            {key:'非会员',value:'noVip'},
            {key:'会员',value:'vip'},
        ],
        codePro:[],
        codeProTemp:[],
        handOneIndex:0,
        handTwoIndex:0
    },
    /*第一层筛选 */
    bindFilterOne(res){
        console.log("第一层筛选的索引:",res.currentTarget.dataset.index);
        const value = res.currentTarget.dataset.value
        this.setData({
            handOneIndex:res.currentTarget.dataset.index
        })
        wx.showLoading({
            title:value
        })
        if(value=='全部'){
            this.setData({
                codePro:this.data.codeProTemp
            })
        }else{
            const rows = this.data.codeProTemp
            const rowsTemp = []
            for(var i =0 ;i<rows.length;i++){
                if(value==rows[i].class){
                    rowsTemp.push(rows[i])
                    this.setData({
                        codePro:rowsTemp,
                    })
                }
            }
        }
        wx.hideLoading()
    },
    /* 第二次筛选 */
    bindFilterTwo(res){
        console.log("第二层筛选的索引:",res.currentTarget.dataset.index);
        const value = res.currentTarget.dataset.value
        this.setData({
            handTwoIndex:res.currentTarget.dataset.index
        })
        if(value=='all'){
            this.setData({
                codePro:this.data.codeProTemp
            })
        }if(value=='noVip'){
            const rows = this.data.codeProTemp
            const rowsTemp = []
            for(var i =0 ;i<rows.length;i++){
                if(rows[i].price==0){
                    rowsTemp.push(rows[i])
                    this.setData({
                        codePro:rowsTemp,
                    })
                }
            }
        }else{
            const rows = this.data.codeProTemp
            const rowsTemp = []
            for(var i =0 ;i<rows.length;i++){
                if(rows[i].price>0){
                    rowsTemp.push(rows[i])
                    this.setData({
                        codePro:rowsTemp,
                    })
                }
            }
        }
    },
    // 模糊匹配
    bindInptTo(e){
        console.log(e.detail.value);
        const value = e.detail.value
        if(e.detail.value.length==0){
            // 输入框为空的时候自动归为
            this.setData({
                codePro:this.data.codeProTemp,
                regexFlag:false
            })
        }else{
            this.setData({
                regexFlag:true
            })
             // 正则表达式匹配 'i' 表示不区分大小写
            const regex = new RegExp(value, 'i'); 
            const matchedData = this.data.codeProTemp.filter(obj => regex.test(obj.title));
            const matchedDataList=matchedData.map(obj=>obj.title)
            console.log(matchedData);
            this.setData({
                regexLists:matchedDataList,
                codePro:matchedData
            })
        }
       
    },
    //详细内容
    navToCodeProDetail(res){
        var index=res.currentTarget.dataset.index
        const idTemp=this.data.codePro[index]._id
        wx.navigateTo({
            url: '/pages/codeProDetail/codeProDetail?id='+idTemp,
        })
        
    },
    /*选择下拉内容 */
    bindClickValue(res){
        var index = res.currentTarget.dataset.index
        this.setData({
            inputValueSearch:this.data.regexLists[index],
            regexFlag:false
        })
    },
    /* 搜素 */
    bindSearchKeyWord(){
        if(this.data.inputValueSearch.length.length==0){
            wx.showToast({
              title: '不能为空！',
              icon:'none'
            })
        }else{
            const value=this.data.inputValueSearch
            const regex = new RegExp(value, 'i'); 
            const matchedData = this.data.codePro.filter(obj => regex.test(obj.title))
            this.setData({
                codePro:matchedData ,
                inputValueSearch:'',
                regexFlag:false
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //是否有人邀请
        if(!wx.getStorageSync('inviteOpenid') && options.openid){
            wx.setStorageSync('inviteOpenid',options.openid)
        }
        console.log('code页面',options);
        // 获取所所有代码项目
        wx.showLoading({
            title:'项目源码'
        })
        wx.cloud.callFunction({
            name:'codeProject',
            success:(res)=>{
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
                    codePro:res.result.data,
                    codeProTemp:res.result.data,
                    codeProLists:modifiedResultArray
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
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage']
        });
        // 传递的参数
        const openid= app.globalData.openid
        return {
            title:'码梦编程星球技术学习',
            path: 'pages/code/code?openid='+openid,
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