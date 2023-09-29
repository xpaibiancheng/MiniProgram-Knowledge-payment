// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'mamengkeji-9g3i82pg37b59653'}) // 使用当前云环境

const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    // 上传服务器所有的微信内支付服务返回的信息
    db.collection("orderFinish").add({
        data:{
            finishTime:new Date().getTime(),
            return_info:event
        }
    })
    // 更新订单
    db.collection('orderStatus').where({
        pay_status:"wait",
        order_number:event.outTradeNo
    }).update({
        data:{
            pay_status:'订单完成',
            update_time:new Date().getTime()
        }
    })
    // 返回指定格式的对象
    return {
        errcode:0,
        errmsg:"支付处理完成"
    }
    
}