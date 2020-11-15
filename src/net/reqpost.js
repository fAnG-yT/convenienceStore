import {request} from './index'
// ifAccount, Order_GoodsList, OrderDelete ,SaveList

export function startShop(){
    return request({
        url:"/ConvenienceStore_war_exploded/order/getOrderId"
    })
}

export function ifVIP(phoneNumber){
    return request({
        url:"/ConvenienceStore_war_exploded/identify"
    })
}

export function getItem(goodsId){
    return request({
        url:"/ConvenienceStore_war_exploded/goods/search",
        data:{
            goodsId
        }
    })
}
export function pay(orderId,list,editform){
    return request({
        url:"/ConvenienceStore_war_exploded/order/pay",
        data:{
            orderId,
            list,
            editform
        }
    })
}

export function OrderDelete(orderId){
    return request({
        url:"/ConvenienceStore_war_exploded/order/delete",
        data:{
            orderId
        }
    })
}