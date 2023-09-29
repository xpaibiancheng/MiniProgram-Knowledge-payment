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


