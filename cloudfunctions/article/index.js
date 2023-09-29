// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db= cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    if(event.value=='all'){
        return await db.collection('article').orderBy('subTime','desc').get({
            success:(res)=>{
                console.log('all',res.data);
            }
        })
    }else{
        return await db.collection('article').where({
            class:event.value
        }).orderBy('subTime','desc').get({
            success:(res)=>{
                console.log('其他',res.data);
            }
        })

    }
    
}