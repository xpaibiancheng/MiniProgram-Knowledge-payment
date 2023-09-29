# MiniProgram-Knowledge-payment
基于云开发的个人博客，知识星球付费小程序
# 小程序预览
![dd239a51025720815a6b683039af39f](https://github.com/xpaibiancheng/MiniProgram-Knowledge-payment/assets/111781660/d7f64c62-6583-4853-87bb-f91c2c5dc6d7)
# 注意
微信小程序已经做好支付接口，支付接口不支持个人，需要优化可以找作者
# 需要更改的地方
1、app.js页面云环境初始化，env改成你自己的小程序
```
// 初始化云环境

    wx.cloud.init({
        env:'mamengkeji-9g3i82pg37b59653'
    })
```
2、有商户号的在cloudfunction目录下的payPre更改index.js的
subMahId：自己的商户号
envId：自己的云环境Id
```
const res = await cloud.cloudPay.unifiedOrder({
        "body" :event.pro_name,
        "outTradeNo" :event.pro_codeNum,
        "spbillCreateIp" : "127.0.0.1",
        "subMchId" : "*******",
        "totalFee" : event.pro_price,
        "envId": "********",
        "functionName": "pay_cb"
      })
```
# 云开发数据库集合名称
```

```

| 序号 | 名称          | 备注                 |
| ---- | ------------- | -------------------- |
| 1    | article       | 文章                 |
| 2    | codePro       | 项目源码             |
| 3    | codeProLists  | 加入学习（项目源码） |
| 4    | guoqingPng    | 国庆节图标           |
| 5    | orderFinish   | 订单完成             |
| 6    | orderStatus   | 订单状态             |
| 7    | studyVideo    | 视频学习             |
| 8    | swiperIndex   | 轮播图               |
| 9    | userinfo      | 用户信息             |
| 10   | videoProLists | 加入学习（视频学习） |
| 11   | vipInfo       | 会员类型的信息       |
| 12   | webNav        | 实用工具             |


# 部署不成功的可以@作者或添加作者

![image](https://github.com/xpaibiancheng/MiniProgram-Knowledge-payment/assets/111781660/5fdee5aa-9af2-4197-a309-4137e1dad352)

# 打赏一杯咖啡
![9d4c13d66559b32621ab2b90dbdbd61](https://github.com/xpaibiancheng/MiniProgram-Knowledge-payment/assets/111781660/250665c7-2ce2-4189-8afa-b18fa8655628)


