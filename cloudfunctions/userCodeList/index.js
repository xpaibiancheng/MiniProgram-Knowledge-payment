// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
// 云函数入口函数
const db = cloud.database()
exports.main = async (event, context) => {
    const value = event.value
    const dist = event.dist
    return await db.collection(dist).where({
        _openid:value
    }).get({})
}