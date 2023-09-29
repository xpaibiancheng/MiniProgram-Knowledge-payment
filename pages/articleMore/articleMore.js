// pages/articleMore/articleMore.js
const app =getApp({})
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classNav:[
            {key:'最新文章',value:'all'},
            {key:'编程技术',value:'code'},
            {key:'IT工具',value:'tools'},
            {key:'每日技巧',value:'understanding'}
        ],
        handIndexOne:0,
        handOneIndex:0,
        articleRows:[],
        articleTempRows:[],
        articleKind:[],
        regexLists:[],
        inputValueSearch:'',
        regexFlag:false
    },
     /* 点击选择类目 */
    bindClickChange(res){
        var index=res.currentTarget.dataset.index
        var value=res.currentTarget.dataset.value
        this.setData({
            handIndexOne:res.currentTarget.dataset.index
        })
        wx.showLoading({
            title:value
        })
        wx.cloud.callFunction({
            name:'article',
            data:{
                value:value
            },success:(res)=>{
                var dataTemp= res.result.data
                /* 分类
                    1、遍历数组
                    2、筛选
                    3、得到resultArray原始 ["java", "小程序", "python", "PHP", "MySQL"]
                    4、新建数组，构造完整 const modifiedResultArray = ['全部', ...resultArray];
                    输出结构：["全部", "java", "小程序", "python", "PHP", "MySQL"]
                */
                const valuesSet = new Set();

                dataTemp.forEach(obj => {
                    const value = obj.kind;
                    valuesSet.add(value);
                });
                const resultArray = Array.from(valuesSet);
                console.log(resultArray);
                const modifiedResultArray = ['全部', ...resultArray];
                console.log(modifiedResultArray);
                this.setData({
                    articleRows:res.result.data,
                    articleTempRows:res.result.data,
                    articleKind:modifiedResultArray
                })
                wx.hideLoading()
            },fail:(res)=>{
                console.log(res);
                wx.hideLoading()
            }
        })
    },
    /*第一层筛选 */
    bindFilterOne(res){
        console.log("第一层筛选的索引:",res.currentTarget.dataset.index);
        console.log("第一层筛选的索引值:",res.currentTarget.dataset.value);
        const value = res.currentTarget.dataset.value
        this.setData({ 
            handOneIndex:res.currentTarget.dataset.index
        })
        wx.showLoading({
            title:value ,
          })
        if(value=='全部'){
            this.setData({
                articleRows:this.data.articleTempRows
            })
        }else{
            const rows = this.data.articleTempRows
            const rowsTemp = []
            for(var i =0 ;i<rows.length;i++){
                if(value==rows[i].kind){
                    rowsTemp.push(rows[i])
                    this.setData({
                        articleRows:rowsTemp,
                    })
                }
            }
        }
        
        wx.hideLoading()
    },
    // 查看文章
    bindIndex(res){
        var index= res.currentTarget.dataset.index
        var id = this.data.articleRows[index]._id
        wx.navigateTo({
          url: '/pages/gongzhongView/gongzhongView?id='+id,
        })
    },
    // 模糊匹配
    bindInptTo(e){
        console.log(e.detail.value);
        const value = e.detail.value
        if(e.detail.value.length==0){
            // 输入框为空的时候自动归为
            this.setData({
                articleRows:this.data.articleTempRows,
                regexFlag:false
            })
        }else{
            this.setData({
                regexFlag:true
            })
             // 正则表达式匹配 'i' 表示不区分大小写
            const regex = new RegExp(value, 'i'); 
            const matchedData = this.data.articleTempRows.filter(obj => regex.test(obj.title));
            const matchedDataList=matchedData.map(obj=>obj.title)
            console.log(matchedData);
            this.setData({
                regexLists:matchedDataList,
                articleRows:matchedData
            })
        }
       
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
            const matchedData = this.data.articleTempRows.filter(obj => regex.test(obj.title))
            this.setData({
                articleRows:matchedData ,
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
        console.log(options);
        wx.showLoading({
          title: '加载中',
        })
        wx.cloud.callFunction({
            name:'article',
            data:{
                value:'all'
            },success:(res)=>{
                var dataTemp= res.result.data
                /* 分类
                    1、遍历数组
                    2、筛选
                    3、得到resultArray原始 ["java", "小程序", "python", "PHP", "MySQL"]
                    4、新建数组，构造完整 const modifiedResultArray = ['全部', ...resultArray];
                    输出结构：["全部", "java", "小程序", "python", "PHP", "MySQL"]
                */
                const valuesSet = new Set();
                dataTemp.forEach(obj => {
                    const value = obj.kind;
                    valuesSet.add(value);
                });
                const resultArray = Array.from(valuesSet);
                console.log(resultArray);
                const modifiedResultArray = ['全部', ...resultArray];
                console.log(modifiedResultArray);
                this.setData({
                    articleRows:res.result.data,
                    articleTempRows:res.result.data,
                    articleKind:modifiedResultArray
                })
                wx.hideLoading()
            }
        })
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
            path: 'pages/articleMore/articleMore?openid='+openid,
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