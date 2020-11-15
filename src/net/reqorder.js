import {request} from './index'

export function getOrder(){
    return request({
        url:'/ConvenienceStore_war_exploded/order/getOrder'
    })
}

export function getSubOrderList(orderId){
    return request({
        url:'/ConvenienceStore_war_exploded/order/getSubOrder',
        data:{
            orderId
        }
    })
}